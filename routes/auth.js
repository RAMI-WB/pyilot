const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// صفحة تسجيل الدخول
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', { error: null, title: 'تسجيل الدخول' });
});

// صفحة إنشاء حساب
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/register', { error: null, title: 'إنشاء حساب جديد' });
});

// معالجة تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length) {
      return res.render('auth/login', { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', title: 'تسجيل الدخول' });
    }
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.render('auth/login', { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', title: 'تسجيل الدخول' });
    }
    req.session.userId = rows[0].id;
    req.session.username = rows[0].username;

    // تحديث الـ streak اليومي
    const today = new Date().toISOString().split('T')[0];
    const lastActive = rows[0].last_active ? rows[0].last_active.toISOString().split('T')[0] : null;
    let newStreak = rows[0].streak || 0;
    if (lastActive) {
      const diff = Math.floor((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }
    await pool.query('UPDATE users SET last_active = $1, streak = $2 WHERE id = $3', [today, newStreak, rows[0].id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'حدث خطأ، حاول مرة أخرى', title: 'تسجيل الدخول' });
  }
});

// معالجة إنشاء حساب
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.render('auth/register', { error: 'جميع الحقول مطلوبة', title: 'إنشاء حساب' });
    }
    if (password.length < 6) {
      return res.render('auth/register', { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', title: 'إنشاء حساب' });
    }
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password_hash, coins, streak, last_active) VALUES ($1, $2, $3, 0, 1, CURRENT_DATE) RETURNING id, username',
      [username, email, hash]
    );
    req.session.userId = rows[0].id;
    req.session.username = rows[0].username;
    res.redirect('/');
  } catch (err) {
    if (err.code === '23505') {
      return res.render('auth/register', { error: 'البريد الإلكتروني أو اسم المستخدم مستخدم مسبقاً', title: 'إنشاء حساب' });
    }
    res.render('auth/register', { error: 'حدث خطأ، حاول مرة أخرى', title: 'إنشاء حساب' });
  }
});

// تسجيل الخروج
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
