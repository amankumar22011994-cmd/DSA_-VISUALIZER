

// NAV
function showSec(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(btn)btn.classList.add('active');
}

// COPY
function copyCode(btn){
  const wrap=btn.parentElement;
  const pre=wrap.querySelector('pre')||btn.closest('.card').querySelector('pre')||btn.closest('.trick-box').querySelector('pre')||btn.closest('.pattern-card').querySelector('pre');
  if(!pre)return;
  navigator.clipboard.writeText(pre.innerText).then(()=>{
    btn.textContent='copied!';btn.classList.add('copied');
    setTimeout(()=>{btn.textContent='copy';btn.classList.remove('copied');},2000);
  });
}

// BIT VIEWER
let bits=new Array(8).fill(0);
function initBits(){
  const d=document.getElementById('bitDisplay');
  if(!d)return;
  d.innerHTML='';
  for(let i=7;i>=0;i--){
    const box=document.createElement('div');
    box.className='bit-box'+(bits[i]?' on':'');
    box.innerHTML=`<div class="bit-val">${bits[i]}</div><div class="bit-pos">2<sup>${i}</sup></div>`;
    box.onclick=()=>toggleBit(i);
    d.appendChild(box);
  }
  updateBitResult();
}
function toggleBit(i){bits[i]=bits[i]?0:1;initBits();}
function updateBitResult(){
  let dec=0;
  for(let i=0;i<8;i++)dec+=bits[i]*(1<<i);
  document.getElementById('bitDec').textContent=dec;
  document.getElementById('bitHex').textContent='Hex: 0x'+dec.toString(16).toUpperCase();
  document.getElementById('bitBin').textContent='Binary: '+dec.toString(2).padStart(8,'0');
}
function setBits(v){
  v=parseInt(v)||0;v=Math.max(0,Math.min(255,v));
  for(let i=0;i<8;i++)bits[i]=(v>>i)&1;
  initBits();
}
initBits();

// OP SIMULATOR
function calcOp(){
  const a=parseInt(document.getElementById('opA').value)||0;
  const b=parseInt(document.getElementById('opB').value)||0;
  const op=document.getElementById('opSel').value;
  const el=document.getElementById('opResult');
  let res,line='';
  const bin=n=>n.toString(2).padStart(8,'0');
  if(op==='and'){res=a&b;line=`<span class="op-highlight">${a}</span> & <span class="op-highlight">${b}</span> = <span class="op-green">${res}</span>\n${bin(a)}\n${bin(b)}\n${'─'.repeat(8)}\n${bin(res)} = <span class="op-green">${res}</span>`;}
  else if(op==='or'){res=a|b;line=`<span class="op-highlight">${a}</span> | <span class="op-highlight">${b}</span> = <span class="op-green">${res}</span>\n${bin(a)}\n${bin(b)}\n${'─'.repeat(8)}\n${bin(res)} = <span class="op-green">${res}</span>`;}
  else if(op==='xor'){res=a^b;line=`<span class="op-highlight">${a}</span> ^ <span class="op-highlight">${b}</span> = <span class="op-green">${res}</span>\n${bin(a)}\n${bin(b)}\n${'─'.repeat(8)}\n${bin(res)} = <span class="op-green">${res}</span>`;}
  else if(op==='not'){res=~a;line=`~<span class="op-highlight">${a}</span> = <span class="op-red">${res}</span>\n${bin(a&0xFF)}\n${'─'.repeat(8)}\n${bin(res&0xFF)} → Formula: ~n = -(n+1) = ${res}`;}
  else if(op==='lshift'){res=a<<b;line=`<span class="op-highlight">${a}</span> &lt;&lt; <span class="op-highlight">${b}</span> = <span class="op-green">${res}</span>\n${a} × 2^${b} = ${a} × ${Math.pow(2,b)} = <span class="op-green">${res}</span>\n${bin(a)} → ${bin(res&0xFF)}`;}
  else if(op==='rshift'){res=a>>b;line=`<span class="op-highlight">${a}</span> &gt;&gt; <span class="op-highlight">${b}</span> = <span class="op-green">${res}</span>\n${a} ÷ 2^${b} = ${a} ÷ ${Math.pow(2,b)} = <span class="op-green">${res}</span>\n${bin(a)} → ${bin(res&0xFF)}`;}
  el.innerHTML=`<pre style="background:none;border:none;padding:0;font-size:12px;line-height:1.8;">${line}</pre>`;
}
calcOp();

// VIZ OPS
function vizOps(){
  const n=parseInt(document.getElementById('vizNum').value)||0;
  const k=parseInt(document.getElementById('vizK').value)||0;
  const bin=x=>x.toString(2).padStart(8,'0');
  const check=(n>>k)&1;
  const setR=n|(1<<k);
  const clearR=n&~(1<<k);
  const toggleR=n^(1<<k);
  document.getElementById('vizResult').innerHTML=`<pre style="background:none;border:none;padding:0;font-size:12px;line-height:2;">n = ${n} → <span class="op-highlight">${bin(n)}</span>    k = ${k}

<span class="op-green">Check bit ${k}:</span>  (n>>${k}) & 1 = <span class="op-highlight">${check}</span>  → bit is <span class="op-highlight">${check?'SET (1)':'CLEAR (0)'}</span>
<span class="op-green">Set   bit ${k}:</span>  n | (1&lt;&lt;${k}) = <span class="op-highlight">${setR}</span>  → ${bin(setR)}
<span class="op-green">Clear bit ${k}:</span>  n & ~(1&lt;&lt;${k}) = <span class="op-highlight">${clearR}</span>  → ${bin(clearR)}
<span class="op-green">Toggle bit ${k}:</span> n ^ (1&lt;&lt;${k}) = <span class="op-highlight">${toggleR}</span>  → ${bin(toggleR)}</pre>`;
}
vizOps();

// XOR DEMO
function xorDemo(){
  const raw=document.getElementById('xorArr').value;
  const arr=raw.split(',').map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
  let res=0,steps=[];
  arr.forEach(x=>{steps.push(`${res} ^ ${x} = ${res^x}`);res^=x;});
  document.getElementById('xorResult').innerHTML=`<pre style="background:none;border:none;padding:0;font-size:12px;line-height:1.8;">Array: [${arr.join(', ')}]
Steps: ${steps.slice(0,5).join(' → ')}${steps.length>5?'...':''}
<span class="op-green">Single Number = ${res}</span>  (sab pairs cancel ho gaye!)</pre>`;
}
function missingDemo(){
  const raw=document.getElementById('xorArr').value;
  const arr=raw.split(',').map(x=>parseInt(x.trim())).filter(x=>!isNaN(x));
  const n=arr.length;
  let res=n;
  for(let i=0;i<n;i++)res^=i^arr[i];
  document.getElementById('xorResult').innerHTML=`<pre style="background:none;border:none;padding:0;font-size:12px;line-height:1.8;">Array: [${arr.join(', ')}] (should be 0..${n})
XOR 0..${n} aur array elements → pairs cancel
<span class="op-green">Missing Number = ${res}</span></pre>`;
}

// QUIZ
let answered=new Array(7).fill(false);
let score=0;
function ans(btn,type,explain){
  const card=btn.closest('.quiz-card');
  const idx=[...document.querySelectorAll('.quiz-card')].indexOf(card);
  if(answered[idx])return;
  answered[idx]=true;
  btn.classList.add(type);
  card.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  const ex=document.getElementById('qe'+idx);
  ex.textContent=explain;ex.classList.add('show');
  if(type==='correct')score++;
  const done=answered.filter(Boolean).length;
  document.getElementById('quiz-progress').style.width=(done/7*100)+'%';
  if(done===7)showScore();
}
function showScore(){
  const sc=document.getElementById('quiz-score');
  sc.style.display='block';
  document.getElementById('score-num').textContent=score+'/7';
  const msgs=['Practice karo — basics se shuru karo!','Keep going — thodi aur practice!','Accha hai — patterns yaad karo!','Bahut accha — almost there!','Excellent — kaafi strong ho!','Zabardast — expert level!','🏆 Perfect Score! Bit Master!'];
  document.getElementById('score-msg').textContent=msgs[score]||'';
}
function resetQuiz(){
  answered=new Array(7).fill(false);score=0;
  document.querySelectorAll('.quiz-opt').forEach(b=>{b.classList.remove('correct','wrong');b.disabled=false;});
  document.querySelectorAll('.quiz-explain').forEach(e=>{e.classList.remove('show');e.textContent='';});
  document.getElementById('quiz-progress').style.width='0%';
  document.getElementById('quiz-score').style.display='none';
}
