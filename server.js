require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { pool, initDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ضبط قالب EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware الأساسية
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// إعداد الجلسات في الذاكرة (بسيط وموثوق)
app.use(session({
  secret: process.env.SESSION_SECRET || 'pyilot-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
    secure: false,
    httpOnly: true
  }
}));

// تمرير بيانات المستخدم لجميع القوالب
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// المسارات (Routes)
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/dashboard'));

// صفحة الخطأ 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'الصفحة غير موجودة', title: '404' });
});

// بدء الخادم بعد تهيئة قاعدة البيانات
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 خادم Pyilot يعمل على المنفذ ${PORT}`);
    console.log(`🌐 افتح المتصفح: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('فشل تهيئة قاعدة البيانات:', err);
  process.exit(1);
});
