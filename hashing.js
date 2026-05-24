

// NAV
function showSec(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(btn) btn.classList.add('active');
}

// COPY
function copyCode(btn) {
  const pre = btn.parentElement.querySelector('pre') || btn.closest('.card').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// HASH VISUAL
function doHash() {
  const v = parseInt(document.getElementById('hashInp').value);
  if(isNaN(v)) return;
  const idx = ((v % 7) + 7) % 7;
  document.querySelectorAll('.bucket').forEach((b,i) => {
    b.classList.remove('filled');
    b.querySelector('.bucket-val').style.color = 'var(--muted)';
    b.querySelector('.bucket-val').textContent = '—';
  });
  const b = document.getElementById('b'+idx);
  b.classList.add('filled');
  b.querySelector('.bucket-val').textContent = v;
  b.querySelector('.bucket-val').style.color = 'var(--accent)';
  document.getElementById('hashRes').textContent =
    `hash(${v}) = ${v} % 7 = ${idx} → Bucket [${idx}] mein store hoga`;
}

// DEMO MAP
const demoMap = {};
function renderMap() {
  const el = document.getElementById('map-store');
  const keys = Object.keys(demoMap);
  if(!keys.length) { el.innerHTML = '<span class="chip-empty">// map empty hai</span>'; return; }
  el.innerHTML = keys.map(k =>
    `<span class="item-chip chip-map">${k}: ${demoMap[k]}</span>`
  ).join('');
}
function mLog(msg, cls='') {
  const el = document.getElementById('map-log');
  el.innerHTML = `<span class="${cls}">${msg}</span>`;
}
function mInsert() {
  const k = document.getElementById('mk').value.trim();
  const v = document.getElementById('mv').value.trim();
  if(!k||!v) { mLog('// ⚠ Key aur Value dono dalo!','log-fail'); return; }
  const isNew = !(k in demoMap);
  demoMap[k] = v;
  renderMap();
  mLog(`// mp["${k}"] = "${v}" → ${isNew ? 'inserted' : 'updated'}`, 'log-ok');
}
function mFind() {
  const k = document.getElementById('mk').value.trim();
  if(!k) { mLog('// ⚠ Key dalo','log-fail'); return; }
  if(k in demoMap) mLog(`// mp.count("${k}") = 1 → Found! value = "${demoMap[k]}"`, 'log-ok');
  else mLog(`// mp.count("${k}") = 0 → Not Found`, 'log-fail');
}
function mDel() {
  const k = document.getElementById('mk').value.trim();
  if(!k) { mLog('// ⚠ Key dalo','log-fail'); return; }
  if(k in demoMap) { delete demoMap[k]; renderMap(); mLog(`// mp.erase("${k}") → deleted`, 'log-ok'); }
  else mLog(`// mp.erase("${k}") → key nahi mili`, 'log-fail');
}
function mClear() { Object.keys(demoMap).forEach(k => delete demoMap[k]); renderMap(); mLog('// mp.clear() → map empty', 'log-info'); }
renderMap();

// DEMO SET
const demoSet = new Set();
function renderSet() {
  const el = document.getElementById('set-store');
  if(!demoSet.size) { el.innerHTML = '<span class="chip-empty">// set empty hai</span>'; return; }
  el.innerHTML = [...demoSet].map(v => `<span class="item-chip chip-set">${v}</span>`).join('');
}
function sLog(msg, cls='') {
  const el = document.getElementById('set-log');
  el.innerHTML = `<span class="${cls}">${msg}</span>`;
}
function sInsert() {
  const v = document.getElementById('sv').value.trim();
  if(!v) { sLog('// ⚠ Value dalo','log-fail'); return; }
  if(demoSet.has(v)) { sLog(`// st.insert(${v}) → duplicate! ignored`, 'log-fail'); return; }
  demoSet.add(v); renderSet();
  sLog(`// st.insert(${v}) → inserted`, 'log-ok');
}
function sFind() {
  const v = document.getElementById('sv').value.trim();
  if(!v) { sLog('// ⚠ Value dalo','log-fail'); return; }
  if(demoSet.has(v)) sLog(`// st.count(${v}) = 1 → Present!`, 'log-ok');
  else sLog(`// st.count(${v}) = 0 → Not Found`, 'log-fail');
}
function sDel() {
  const v = document.getElementById('sv').value.trim();
  if(!v) { sLog('// ⚠ Value dalo','log-fail'); return; }
  if(demoSet.has(v)) { demoSet.delete(v); renderSet(); sLog(`// st.erase(${v}) → deleted`, 'log-ok'); }
  else sLog(`// st.erase(${v}) → not found`, 'log-fail');
}
function sClear() { demoSet.clear(); renderSet(); sLog('// st.clear() → set empty','log-info'); }
renderSet();

// QUIZ
let quizAnswered = new Array(5).fill(false);
let score = 0;
function answer(btn, type, explain) {
  const card = btn.closest('.quiz-card');
  const qIdx = [...document.querySelectorAll('.quiz-card')].indexOf(card);
  if(quizAnswered[qIdx]) return;
  quizAnswered[qIdx] = true;
  btn.classList.add(type);
  card.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
  const ex = document.getElementById('qe'+qIdx);
  ex.textContent = explain;
  ex.classList.add('show');
  if(type === 'correct') score++;
  const done = quizAnswered.filter(Boolean).length;
  document.getElementById('quiz-progress').style.width = (done/5*100)+'%';
  if(done === 5) showScore();
}
function showScore() {
  const sc = document.getElementById('quiz-score');
  sc.style.display = 'block';
  document.getElementById('score-num').textContent = score+'/5';
  const msgs = ['Practice karo!','Theek hai, aur try karo!','Accha hai!','Bahut accha!','Perfect! Master ho gaye!'];
  document.getElementById('score-msg').textContent = msgs[score] || '';
}
function resetQuiz() {
  quizAnswered = new Array(5).fill(false);
  score = 0;
  document.querySelectorAll('.quiz-opt').forEach(b => { b.classList.remove('correct','wrong'); b.disabled=false; });
  document.querySelectorAll('.quiz-explain').forEach(e => { e.classList.remove('show'); e.textContent=''; });
  document.getElementById('quiz-progress').style.width = '0%';
  document.getElementById('quiz-score').style.display = 'none';
}
