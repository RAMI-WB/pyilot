const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const lessons = [
  {
    title: 'مرحباً بعالم البرمجة',
    description: 'تعرف على أساسيات البرمجة وما هو الكود',
    unit: 1, order: 1, xp: 10,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ما هي البرمجة؟',
          options: ['إعطاء تعليمات للحاسوب', 'رسم الصور', 'كتابة القصص', 'تصميم الملابس'],
          answer: 0, explanation: 'البرمجة هي كتابة تعليمات يفهمها الحاسوب لتنفيذ مهام معينة' },
        { id: 2, type: 'choice', question: 'ما هو أول برنامج يكتبه المبرمجون عادةً؟',
          options: ['Hello World', 'My Program', 'Start', 'Main'],
          answer: 0, explanation: 'Hello World هو تقليد قديم يبدأ به المبرمجون لطباعة أول رسالة' },
        { id: 3, type: 'code', question: 'أكمل الكود لطباعة مرحباً بالعالم',
          starterCode: 'print(_____)', answer: 'print("مرحباً بالعالم")', hint: 'استخدم print() مع النص بين علامتي اقتباس' }
      ]
    }
  },
  {
    title: 'المتغيرات والأرقام',
    description: 'تعلم كيف تخزن البيانات في متغيرات',
    unit: 1, order: 2, xp: 15,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ما هو المتغير في البرمجة؟',
          options: ['صندوق لتخزين البيانات', 'نوع من الأخطاء', 'أمر للحاسوب', 'تصميم للصفحة'],
          answer: 0, explanation: 'المتغير هو مساحة في الذاكرة لتخزين قيمة يمكن تغييرها' },
        { id: 2, type: 'code', question: 'أنشئ متغيراً اسمه age يساوي 20',
          starterCode: 'age = _____', answer: 'age = 20', hint: 'اكتب الرقم مباشرة بعد علامة يساوي' },
        { id: 3, type: 'choice', question: 'ما نتيجة: x = 5 + 3 ؟',
          options: ['x = 8', 'x = 53', 'x = 5', 'خطأ'],
          answer: 0, explanation: '5 + 3 = 8 لذا x ستساوي 8' }
      ]
    }
  },
  {
    title: 'النصوص والكلمات',
    description: 'تعامل مع النصوص وكيف تطبعها',
    unit: 1, order: 3, xp: 15,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'كيف تكتب نصاً في Python؟',
          options: ['بين علامتي اقتباس', 'بين قوسين', 'بين أقواس معقوفة', 'بدون أي علامات'],
          answer: 0, explanation: 'النصوص في Python تكتب بين علامتي اقتباس مفردة أو مزدوجة' },
        { id: 2, type: 'code', question: 'اجمع اسمك مع جملة يحب البرمجة',
          starterCode: 'name = "أحمد"\nprint(name + _____)', answer: 'print(name + " يحب البرمجة")', hint: 'استخدم + لدمج النصوص' }
      ]
    }
  },
  {
    title: 'الشروط والقرارات',
    description: 'تعلم كيف يتخذ البرنامج قرارات',
    unit: 2, order: 1, xp: 20,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ما معنى if في البرمجة؟',
          options: ['إذا', 'لكل', 'بينما', 'طالما'],
          answer: 0, explanation: 'if تعني إذا وتستخدم للتحقق من شرط معين' },
        { id: 2, type: 'code', question: 'اكتب شرطاً إذا كان العمر أكبر من 18',
          starterCode: 'age = 20\nif age _____ 18:\n    print("بالغ")', answer: 'if age > 18:', hint: 'استخدم > للمقارنة بأكبر من' }
      ]
    }
  },
  {
    title: 'الحلقات التكرارية',
    description: 'كرر الأوامر بطريقة ذكية',
    unit: 2, order: 2, xp: 20,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ماذا تفعل حلقة for؟',
          options: ['تكرر كود لعدد معين من المرات', 'تتحقق من شرط', 'تنشئ دالة', 'تخزن بيانات'],
          answer: 0, explanation: 'حلقة for تكرر مجموعة من الأوامر لعدد محدد من المرات' },
        { id: 2, type: 'code', question: 'اطبع الأرقام من 1 إلى 5',
          starterCode: 'for i in range(_____):\n    print(i)', answer: 'for i in range(1, 6):', hint: 'range(1, 6) يعطيك الأرقام من 1 حتى 5' }
      ]
    }
  },
  {
    title: 'الدوال والوظائف',
    description: 'اكتب كوداً قابلاً لإعادة الاستخدام',
    unit: 2, order: 3, xp: 25,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ما فائدة الدالة Function؟',
          options: ['تجميع كود يمكن استخدامه مرات عديدة', 'حذف الأخطاء', 'تسريع الحاسوب', 'تغيير الألوان'],
          answer: 0, explanation: 'الدالة تتيح كتابة الكود مرة واحدة واستخدامه متى أردت' },
        { id: 2, type: 'code', question: 'عرف دالة تطبع التحية',
          starterCode: 'def greet():\n    _____', answer: 'def greet():\n    print("أهلاً وسهلاً!")', hint: 'استخدم print() داخل الدالة' }
      ]
    }
  },
  {
    title: 'القوائم والمصفوفات',
    description: 'خزن مجموعات من البيانات',
    unit: 3, order: 1, xp: 25,
    content: {
      questions: [
        { id: 1, type: 'choice', question: 'ما هي القائمة List في Python؟',
          options: ['مجموعة من العناصر بين أقواس مربعة', 'رقم واحد', 'نص طويل', 'ملف كود'],
          answer: 0, explanation: 'القائمة هي مجموعة عناصر داخل [] مفصولة بفواصل' },
        { id: 2, type: 'code', question: 'أنشئ قائمة تحتوي على 3 ألوان',
          starterCode: 'colors = [_____, _____, _____]', answer: 'colors = ["أحمر", "أخضر", "أزرق"]', hint: 'اكتب النصوص داخل الأقواس المربعة مفصولة بفواصل' }
      ]
    }
  }
];

const initDB = async () => {
  const client = await pool.connect();
  try {
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

    const { rows } = await client.query('SELECT COUNT(*) FROM lessons');
    if (parseInt(rows[0].count) === 0) {
      for (const lesson of lessons) {
        await client.query(
          'INSERT INTO lessons (title, description, unit, order_in_unit, xp_reward, lesson_type, content) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [lesson.title, lesson.description, lesson.unit, lesson.order, lesson.xp, 'quiz', JSON.stringify(lesson.content)]
        );
      }
      console.log('تم إدراج الدروس النموذجية');
    }
    console.log('قاعدة البيانات جاهزة');
  } catch (err) {
    console.error('خطأ في قاعدة البيانات:', err.message);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
