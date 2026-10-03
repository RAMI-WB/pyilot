/* Pyilot — Main Frontend JS */

// ── Pilot AI Assistant ──────────────────────────
let pilotOpen = false;

function togglePilot() {
  pilotOpen = !pilotOpen;
  const panel = document.getElementById('pilotPanel');
  if (panel) {
    panel.style.display = pilotOpen ? 'flex' : 'none';
  }
}

const pilotAnswers = {
  'مرحبا': 'أهلاً وسهلاً! 😊 كيف أقدر أساعدك في رحلتك البرمجية؟',
  'ما هي بايثون': 'Python هي لغة برمجة سهلة التعلم وقوية جداً. تُستخدم في الذكاء الاصطناعي، تطوير المواقع، وتحليل البيانات! 🐍',
  'print': 'دالة print() تُستخدم لطباعة النص على الشاشة. مثال: print("مرحباً") ستطبع: مرحباً',
  'متغير': 'المتغير هو "صندوق" تخزن فيه قيمة. مثال: x = 10 يُخزن الرقم 10 في x',
  'حلقة': 'الحلقات تكرر الأوامر. for i in range(5) تنفذ الكود 5 مرات 🔄',
  'if': 'جملة if تتحقق من شرط. if x > 5: تعني "إذا كان x أكبر من 5 فافعل..."',
  'دالة': 'الدالة (Function) كتلة كود يمكن استدعاؤها. def my_func(): تُعرّف دالة جديدة',
  'قائمة': 'القائمة (List) تخزن عدة عناصر: fruits = ["تفاح", "برتقال", "مانجو"]',
  'خطأ': 'إذا وجدت خطأ في كودك، تحقق من: الأقواس، علامات الاقتباس، والمسافات 🔍',
  'streak': 'الـ Streak هو عدد أيامك المتتالية في التعلم! واصل التعلم يومياً للحفاظ عليه 🔥',
  'نقاط': 'تكسب النقاط 💎 بإكمال الدروس. كلما أكملت أكثر، كلما ربحت أكثر!',
};

function getPilotReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(pilotAnswers)) {
    if (lower.includes(key)) return val;
  }
  const tips = [
    'سؤال رائع! جرب البحث عنه في Google أو اسألني بطريقة أخرى 😊',
    'لست متأكداً من هذا، لكن استمر في الدروس وستجد الإجابة! 💪',
    'هذا سؤال متقدم! أنهِ الدروس الحالية أولاً ثم سأشرح لك 🎯',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function sendPilot() {
  const input = document.getElementById('pilotInput');
  const messages = document.getElementById('pilotMessages');
  if (!input || !messages) return;
  
  const msg = input.value.trim();
  if (!msg) return;

  // رسالة المستخدم
  const userDiv = document.createElement('div');
  userDiv.className = 'pilot-msg user';
  userDiv.textContent = msg;
  messages.appendChild(userDiv);

  input.value = '';

  // رد البوت
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'pilot-msg bot';
    botDiv.textContent = getPilotReply(msg);
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 600);

  messages.scrollTop = messages.scrollHeight;
}

// ── Coin animation helper ───────────────────────
function animateCoinEarn(amount) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed; top:70px; right:1rem; z-index:999;
    background:#ffd700; color:#000; font-weight:900;
    padding:.5rem 1.2rem; border-radius:999px;
    animation: slideUp .3s ease, fadeOut .5s ease 1s forwards;
    pointer-events:none; font-family: Cairo, sans-serif;
  `;
  el.textContent = `+${amount} 💎`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

// Add fadeOut keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes fadeOut { to { opacity: 0; transform: translateY(-20px); } }`;
document.head.appendChild(style);
