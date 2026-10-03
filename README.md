<<<<<<< HEAD
# 🐍 Pyilot — منصة تعلم البرمجة بالعربية

> منصة تعليمية تفاعلية مبنية بأسلوب التلغيب (Gamification) لتعلم Python باللغة العربية

---

## 📁 هيكل المشروع

```
pyilot/
├── server.js              ← نقطة البداية - الخادم الرئيسي
├── package.json           ← تبعيات المشروع
├── render.yaml            ← إعدادات النشر على Render
├── .env.example           ← نموذج متغيرات البيئة
├── .gitignore
│
├── config/
│   └── database.js        ← اتصال PostgreSQL + إنشاء الجداول
│
├── routes/
│   ├── auth.js            ← تسجيل الدخول / إنشاء حساب / خروج
│   └── dashboard.js       ← الصفحة الرئيسية + الدروس + API
│
├── views/                 ← قوالب EJS (HTML)
│   ├── dashboard.ejs      ← خريطة الدروس الرئيسية
│   ├── profile.ejs        ← الملف الشخصي
│   ├── error.ejs
│   ├── partials/
│   │   ├── header.ejs     ← الشريط العلوي مع الإحصائيات
│   │   └── footer.ejs     ← مساعد Pyilot الذكي
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   └── lessons/
│       └── lesson.ejs     ← صفحة الدرس + محرر الكود
│
└── public/
    ├── css/style.css      ← كامل التصميم (RTL + Dark Mode)
    └── js/main.js         ← JavaScript للواجهة + مساعد Pyilot
```

---

## 🚀 دليل الرفع على GitHub و Render (خطوة بخطوة)

### الخطوة ١: تثبيت الأدوات المطلوبة
تأكد من تثبيت:
- [Node.js](https://nodejs.org) (الإصدار 18 أو أحدث)
- [Git](https://git-scm.com)

### الخطوة ٢: إنشاء مستودع على GitHub
1. افتح [github.com](https://github.com) وسجّل دخولك
2. اضغط **New Repository**
3. اسم المستودع: `pyilot`
4. اتركه **Public**
5. اضغط **Create Repository**

### الخطوة ٣: رفع الملفات على GitHub
افتح Terminal/CMD داخل مجلد المشروع:

```bash
git init
git add .
git commit -m "🚀 أول إصدار من Pyilot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pyilot.git
git push -u origin main
```
> استبدل `YOUR_USERNAME` باسم حسابك على GitHub

### الخطوة ٤: إنشاء قاعدة بيانات مجانية على Supabase
1. افتح [supabase.com](https://supabase.com) وأنشئ حساباً مجانياً
2. اضغط **New Project**
3. أدخل اسم المشروع: `pyilot`
4. اختر كلمة مرور قوية واحفظها
5. بعد الإنشاء، اذهب إلى **Settings → Database**
6. انسخ رابط الاتصال من قسم **Connection String → URI**
7. الرابط يبدو هكذا: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

> **ملاحظة:** يمكنك أيضاً استخدام PostgreSQL المجاني من Render مباشرة (موضح في الخطوة ٦)

### الخطوة ٥: النشر على Render
1. افتح [render.com](https://render.com) وأنشئ حساباً مجانياً
2. اضغط **New → Web Service**
3. اختر **Connect a repository** وربط حساب GitHub
4. اختر مستودع `pyilot`
5. اضبط الإعدادات:
   - **Name:** pyilot
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. اضغط **Advanced** ثم **Add Environment Variable**:
   - `DATABASE_URL` = رابط قاعدة البيانات من Supabase
   - `SESSION_SECRET` = أي نص عشوائي طويل مثل: `pyilot2024xK9mN`
   - `NODE_ENV` = `production`
7. اضغط **Create Web Service**

### الخطوة ٦: استخدام PostgreSQL من Render مباشرة (بديل Supabase)
1. اضغط **New → PostgreSQL**
2. الاسم: `pyilot-db`، الخطة: **Free**
3. اضغط **Create Database**
4. من صفحة قاعدة البيانات، انسخ **Internal Database URL**
5. ضعه في متغيرات بيئة Web Service كـ `DATABASE_URL`

### الخطوة ٧: التحقق من نجاح النشر
- انتظر 3-5 دقائق حتى ينتهي البناء
- ستجد رابط موقعك مثل: `https://pyilot.onrender.com`
- الموقع سيُنشئ قاعدة البيانات والجداول تلقائياً عند أول تشغيل!

---

## 🔧 تشغيل المشروع محلياً للتطوير

```bash
# ١. انسخ ملف البيئة
cp .env.example .env

# ٢. عدّل ملف .env وضع رابط قاعدة بياناتك المحلية
# DATABASE_URL=postgresql://postgres:password@localhost:5432/pyilot
# SESSION_SECRET=dev_secret_123

# ٣. ثبّت المكتبات
npm install

# ٤. شغّل الخادم
npm run dev
# أو: node server.js

# ٥. افتح المتصفح على:
# http://localhost:3000
```

---

## ✨ الميزات المضمّنة

| الميزة | التفاصيل |
|--------|----------|
| 🗺️ خريطة الدروس | Skill Tree بتصميم تفاعلي مع تتبع التقدم |
| 🔒 نظام القفل | الدروس تُفتح تدريجياً بعد إكمال السابقة |
| ⭐ نظام النجوم | 1-3 نجوم حسب الأداء في كل درس |
| 🔥 Streak يومي | تتبع الأيام المتتالية للتعلم |
| 💎 نقاط الجواهر | مكافآت رقمية على إكمال الدروس |
| 💻 محرر كود | تنفيذ كود Python مباشرة في المتصفح |
| 🤖 Pyilot AI | مساعد ذكي للإجابة على أسئلة البرمجة |
| 👤 ملف شخصي | إحصائيات المستخدم وتقدمه |
| 📱 متجاوب | يعمل على الهاتف والحاسوب |
| 🌙 Dark Mode | واجهة داكنة مريحة للعين |

---

## 🗃️ جداول قاعدة البيانات

- **users** — بيانات المستخدمين (اسم، إيميل، نقاط، streak)
- **lessons** — الدروس والمحتوى (مخزّن كـ JSON)
- **user_progress** — تقدم كل مستخدم في كل درس
- **daily_streak** — سجل النشاط اليومي

---

## 📝 إضافة دروس جديدة

لإضافة درس جديد، أضف سجلاً في جدول `lessons`:

```sql
INSERT INTO lessons (title, description, unit, order_in_unit, xp_reward, lesson_type, content)
VALUES (
  'عنوان الدرس', 
  'وصف مختصر', 
  1,  -- رقم الوحدة
  4,  -- ترتيبه في الوحدة
  20, -- نقاط المكافأة
  'quiz',
  '{"questions": [...]}'
);
```

---

## 🆓 حدود الخطة المجانية على Render

- **Web Service:** ينام بعد 15 دقيقة من عدم الاستخدام (يستيقظ عند أول طلب ~30 ثانية)
- **PostgreSQL:** 1GB مساحة، حتى 90 يوم ثم يحتاج إعادة إنشاء
- **الحل:** استخدم Supabase للقاعدة (مجاني دائماً) + Render للخادم

---

مصنوع بـ ❤️ لتعليم البرمجة بالعربية
=======
# pyilot
>>>>>>> 518ccbaa629b83420076248a1c790ce90617760d
