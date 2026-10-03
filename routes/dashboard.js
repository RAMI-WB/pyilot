const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Middleware للتحقق من تسجيل الدخول
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

// الصفحة الرئيسية - خريطة الدروس
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    const user = userRows[0];

    const { rows: lessons } = await pool.query(
      'SELECT * FROM lessons WHERE is_active = TRUE ORDER BY unit, order_in_unit'
    );

    const { rows: progress } = await pool.query(
      'SELECT lesson_id, completed, stars FROM user_progress WHERE user_id = $1',
      [req.session.userId]
    );

    const progressMap = {};
    progress.forEach(p => { progressMap[p.lesson_id] = p; });

    // تنظيم الدروس في وحدات
    const units = {};
    lessons.forEach(lesson => {
      if (!units[lesson.unit]) units[lesson.unit] = { lessons: [] };
      units[lesson.unit].lessons.push({
        ...lesson,
        progress: progressMap[lesson.id] || { completed: false, stars: 0 }
      });
    });

    res.render('dashboard', { user, units, title: 'خريطة الدروس' });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'حدث خطأ في تحميل البيانات' });
  }
});

// صفحة درس محدد
router.get('/lesson/:id', requireAuth, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { rows: lessonRows } = await pool.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (!lessonRows.length) return res.redirect('/');

    const lesson = lessonRows[0];
    const { rows: progressRows } = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [req.session.userId, lessonId]
    );

    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);

    res.render('lessons/lesson', {
      lesson,
      progress: progressRows[0] || null,
      user: userRows[0],
      title: lesson.title
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// API: حفظ نتيجة الدرس
router.post('/api/lesson/:id/complete', requireAuth, async (req, res) => {
  const lessonId = parseInt(req.params.id);
  const { stars, xp } = req.body;
  const userId = req.session.userId;

  try {
    const { rows: lessonRows } = await pool.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (!lessonRows.length) return res.json({ success: false });
    const lesson = lessonRows[0];

    // تحديث أو إنشاء سجل التقدم
    await pool.query(`
      INSERT INTO user_progress (user_id, lesson_id, completed, stars, attempts, completed_at)
      VALUES ($1, $2, TRUE, $3, 1, NOW())
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET completed = TRUE, stars = GREATEST(user_progress.stars, $3), attempts = user_progress.attempts + 1, completed_at = NOW()
    `, [userId, lessonId, stars || 3]);

    // إضافة النقاط للمستخدم
    const earnedXP = xp || lesson.xp_reward;
    await pool.query('UPDATE users SET coins = coins + $1 WHERE id = $2', [earnedXP, userId]);

    // تسجيل النشاط اليومي
    const today = new Date().toISOString().split('T')[0];
    await pool.query(`
      INSERT INTO daily_streak (user_id, date, xp_earned) VALUES ($1, $2, $3)
      ON CONFLICT (user_id, date) DO UPDATE SET xp_earned = daily_streak.xp_earned + $3
    `, [userId, today, earnedXP]);

    const { rows: updatedUser } = await pool.query('SELECT coins, streak FROM users WHERE id = $1', [userId]);
    res.json({ success: true, coins: updatedUser[0].coins, streak: updatedUser[0].streak, xpEarned: earnedXP });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// API: تشغيل كود Python
router.post('/api/run-code', requireAuth, (req, res) => {
  const { code } = req.body;
  // محاكاة تنفيذ الكود (للأمان نستخدم محاكاة محدودة)
  try {
    const output = simulatePython(code);
    res.json({ success: true, output });
  } catch (err) {
    res.json({ success: false, output: `خطأ: ${err.message}` });
  }
});

// محاكاة بسيطة لكود Python الأساسي
function simulatePython(code) {
  const lines = code.trim().split('\n');
  const output = [];
  const variables = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // print()
    const printMatch = trimmed.match(/^print\((.+)\)$/);
    if (printMatch) {
      let val = printMatch[1].trim();
      // إزالة علامات الاقتباس
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        output.push(val.slice(1, -1));
      } else if (variables[val] !== undefined) {
        output.push(String(variables[val]));
      } else if (/^\d+$/.test(val)) {
        output.push(val);
      } else {
        // تقييم تعبيرات بسيطة
        try {
          const resolved = val.replace(/\b([a-zA-Z_]\w*)\b/g, m => variables[m] !== undefined ? variables[m] : m);
          const result = Function(`"use strict"; return (${resolved})`)();
          output.push(String(result));
        } catch {
          output.push(`[نتيجة: ${val}]`);
        }
      }
      continue;
    }

    // تعيين متغير
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
      const [, varName, expr] = assignMatch;
      let val = expr.trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        variables[varName] = val.slice(1, -1);
      } else if (/^\d+$/.test(val)) {
        variables[varName] = parseInt(val);
      } else {
        try {
          const resolved = val.replace(/\b([a-zA-Z_]\w*)\b/g, m => variables[m] !== undefined ? variables[m] : m);
          variables[varName] = Function(`"use strict"; return (${resolved})`)();
        } catch {
          variables[varName] = val;
        }
      }
    }
  }

  return output.length ? output.join('\n') : '(لا يوجد مخرجات)';
}

// صفحة الملف الشخصي
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    const { rows: progressRows } = await pool.query(
      'SELECT COUNT(*) as completed FROM user_progress WHERE user_id = $1 AND completed = TRUE',
      [req.session.userId]
    );
    res.render('profile', { user: userRows[0], stats: progressRows[0], title: 'ملفي الشخصي' });
  } catch (err) {
    res.redirect('/');
  }
});

module.exports = router;
