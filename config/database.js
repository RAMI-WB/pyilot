const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    // إنشاء الجداول
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        coins INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_active DATE,
        is_pro BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        unit INTEGER NOT NULL,
        order_in_unit INTEGER NOT NULL,
        xp_reward INTEGER DEFAULT 10,
        lesson_type VARCHAR(50) DEFAULT 'quiz',
        content JSONB,
        is_active BOOLEAN DEFAULT TRUE
      );
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        stars INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
      CREATE TABLE IF NOT EXISTS daily_streak (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        xp_earned INTEGER DEFAULT 0,
        UNIQUE(user_id, date)
      );
    `);
    console.log('الجداول جاهزة');

    // التحقق من وجود دروس
    const { rows } = await client.query('SELECT COUNT(*) as count FROM lessons');
    const count = parseInt(rows[0].count);
    console.log('عدد الدروس الحالي:', count);

    if (count === 0) {
      console.log('جاري إدراج الدروس...');
      await insertLessons(client);
      console.log('تم إدراج الدروس بنجاح');
    }

    console.log('قاعدة البيانات جاهزة تماماً');
  } catch (err) {
    console.error('خطأ في initDB:', err.message);
    console.error(err.stack);
    throw err;
  } finally {
    client.release();
  }
};

const insertLessons = async (client) => {
  const q = 'INSERT INTO lessons (title, description, unit, order_in_unit, xp_reward, lesson_type, content) VALUES ($1,$2,$3,$4,$5,$6,$7)';

  // الوحدة الأولى
  await client.query(q, ['مرحباً بعالم البرمجة', 'تعرف على أساسيات البرمجة', 1, 1, 10, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ما هي البرمجة؟',
        options:['إعطاء تعليمات للحاسوب','رسم الصور','كتابة القصص','تصميم الملابس'],
        answer:0, explanation:'البرمجة هي كتابة تعليمات يفهمها الحاسوب' },
      { id:2, type:'choice', question:'ما هو أول برنامج يكتبه المبرمجون؟',
        options:['Hello World','My Program','Start','Main'],
        answer:0, explanation:'Hello World تقليد قديم يبدأ به المبرمجون' },
      { id:3, type:'code', question:'أكمل الكود لطباعة مرحباً',
        starterCode:'print(_____)', answer:'print("مرحباً")', hint:'ضع النص بين علامتي اقتباس' }
    ]})
  ]);

  await client.query(q, ['المتغيرات والأرقام', 'تعلم كيف تخزن البيانات في متغيرات', 1, 2, 15, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ما هو المتغير في البرمجة؟',
        options:['صندوق لتخزين البيانات','نوع من الأخطاء','أمر للحاسوب','تصميم للصفحة'],
        answer:0, explanation:'المتغير مساحة في الذاكرة لتخزين قيمة' },
      { id:2, type:'code', question:'أنشئ متغيراً اسمه age يساوي 20',
        starterCode:'age = _____', answer:'age = 20', hint:'اكتب الرقم بعد علامة يساوي' },
      { id:3, type:'choice', question:'ما نتيجة x = 5 + 3',
        options:['8','53','5','خطأ'],
        answer:0, explanation:'5 + 3 = 8' }
    ]})
  ]);

  await client.query(q, ['النصوص والكلمات', 'تعامل مع النصوص وكيف تطبعها', 1, 3, 15, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'كيف تكتب نصاً في Python؟',
        options:['بين علامتي اقتباس','بين قوسين','بدون علامات','بين أقواس'],
        answer:0, explanation:'النصوص تكتب بين علامتي اقتباس' },
      { id:2, type:'code', question:'اطبع اسمك',
        starterCode:'print(_____)', answer:'print("اسمك")', hint:'ضع اسمك بين علامتي اقتباس' }
    ]})
  ]);

  // الوحدة الثانية
  await client.query(q, ['الشروط والقرارات', 'تعلم كيف يتخذ البرنامج قرارات', 2, 1, 20, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ما معنى if في البرمجة؟',
        options:['إذا','لكل','بينما','طالما'],
        answer:0, explanation:'if تعني إذا وتستخدم للتحقق من شرط' },
      { id:2, type:'code', question:'اكتب شرطاً للتحقق من العمر',
        starterCode:'age = 20\nif age _____ 18:\n    print("بالغ")', answer:'if age > 18:', hint:'استخدم > للمقارنة' }
    ]})
  ]);

  await client.query(q, ['الحلقات التكرارية', 'كرر الأوامر بطريقة ذكية', 2, 2, 20, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ماذا تفعل حلقة for؟',
        options:['تكرر كود لعدد من المرات','تتحقق من شرط','تنشئ دالة','تخزن بيانات'],
        answer:0, explanation:'حلقة for تكرر الأوامر لعدد محدد من المرات' },
      { id:2, type:'code', question:'اطبع الأرقام من 1 إلى 5',
        starterCode:'for i in range(_____):\n    print(i)', answer:'for i in range(1, 6):', hint:'range(1, 6) يعطيك 1 حتى 5' }
    ]})
  ]);

  await client.query(q, ['الدوال والوظائف', 'اكتب كوداً قابلاً لإعادة الاستخدام', 2, 3, 25, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ما فائدة الدالة Function؟',
        options:['كود يمكن استخدامه مرات عديدة','حذف الأخطاء','تسريع الحاسوب','تغيير الألوان'],
        answer:0, explanation:'الدالة تتيح كتابة الكود مرة واحدة واستخدامه متى أردت' },
      { id:2, type:'code', question:'عرّف دالة تطبع التحية',
        starterCode:'def greet():\n    _____', answer:'def greet():\n    print("أهلاً!")', hint:'استخدم print() داخل الدالة' }
    ]})
  ]);

  // الوحدة الثالثة
  await client.query(q, ['القوائم والمصفوفات', 'خزّن مجموعات من البيانات', 3, 1, 25, 'quiz',
    JSON.stringify({ questions: [
      { id:1, type:'choice', question:'ما هي القائمة List في Python؟',
        options:['مجموعة عناصر بين أقواس مربعة','رقم واحد','نص طويل','ملف كود'],
        answer:0, explanation:'القائمة هي مجموعة عناصر داخل []' },
      { id:2, type:'code', question:'أنشئ قائمة بثلاثة أسماء',
        starterCode:'names = [_____, _____, _____]', answer:'names = ["علي", "سارة", "محمد"]', hint:'اكتب الأسماء بين علامات اقتباس مفصولة بفواصل' }
    ]})
  ]);
};

module.exports = { pool, initDB };
