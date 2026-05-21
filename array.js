
// ═══ NAV ═══
function S(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(btn)btn.classList.add('active');
}

// ═══ COPY ═══
function cp(btn){
  const wrap=btn.parentElement;
  let pre=wrap.querySelector('pre');
  if(!pre) pre=btn.closest('.card')?.querySelector('pre')||btn.closest('.pat-card')?.querySelector('pre')||btn.closest('.trick')?.querySelector('pre');
  if(!pre)return;
  navigator.clipboard.writeText(pre.innerText.trim()).then(()=>{
    btn.textContent='✓ copied';btn.classList.add('ok');
    setTimeout(()=>{btn.textContent='copy';btn.classList.remove('ok');},1800);
  });
}

// ═══ BASIC ARRAY ═══
const basicData=[10,25,7,43,18,36];
function renderBasicArr(hl=-1){
  const el=document.getElementById('basicArr');
  el.innerHTML=basicData.map((v,i)=>`<div class="arr-cell"><div class="arr-box${i===hl?' hl':''}">${v}</div><div class="arr-idx">[${i}]</div></div>`).join('');
}
function accessElem(){
  const i=parseInt(document.getElementById('accessIdx').value);
  if(isNaN(i)||i<0||i>5){document.getElementById('accessLog').textContent='⚠ Index 0-5 ke beech daalo!';return;}
  renderBasicArr(i);
  document.getElementById('accessLog').textContent=`arr[${i}] = ${basicData[i]}  →  O(1) access! Address = base + ${i} × 4`;
}
function resetBasicArr(){renderBasicArr();document.getElementById('accessLog').textContent='// arr[i] directly access karo O(1) mein';}
renderBasicArr();

// ═══ VECTOR SIMULATOR ═══
let vec=[];
function renderVec(){
  const el=document.getElementById('vecDisplay');
  const lbl=document.getElementById('vecLabel');
  lbl.textContent=`vector<int> v = [${vec.join(', ')}]  (size: ${vec.length})`;
  if(!vec.length){el.innerHTML='<span style="color:var(--muted);font-family:\'JetBrains Mono\',monospace;font-size:12px;">// empty</span>';return;}
  el.innerHTML=vec.map((v,i)=>`<div class="arr-cell"><div class="arr-box">${v}</div><div class="arr-idx">[${i}]</div></div>`).join('');
}
function vLog(m,c=''){const el=document.getElementById('vecLog');el.textContent=m;}
function vecPush(){const v=document.getElementById('vecVal').value.trim();if(!v){vLog('⚠ Value daalo!');return;}vec.push(parseInt(v)||v);renderVec();vLog(`v.push_back(${v}) → size=${vec.length} ✓`);}
function vecPop(){if(!vec.length){vLog('⚠ Vector empty hai!');return;}const v=vec.pop();renderVec();vLog(`v.pop_back() → removed ${v}, size=${vec.length} ✓`);}
function vecAccess(){const i=parseInt(document.getElementById('vecIdx').value);if(isNaN(i)||i<0||i>=vec.length){vLog(`⚠ Index out of range! Valid: 0-${vec.length-1}`);return;}vLog(`v[${i}] = ${vec[i]}  →  O(1) access ✓`);}
function vecErase(){const i=parseInt(document.getElementById('vecIdx').value);if(isNaN(i)||i<0||i>=vec.length){vLog(`⚠ Invalid index! Valid: 0-${vec.length-1}`);return;}const v=vec.splice(i,1)[0];renderVec();vLog(`v.erase(begin+${i}) → removed ${v}, elements shifted O(n) ✓`);}
function vecClear(){vec=[];renderVec();vLog('v.clear() → vector empty ✓');}
renderVec();

// ═══ BINARY SEARCH SIMULATOR ═══
const bsData=[2,5,8,12,16,23,38,56,72,91];
let bsHighlights={};
function renderBSArr(marks={}){
  const el=document.getElementById('bsArr');
  el.innerHTML=bsData.map((v,i)=>{
    let cls='';
    if(marks[i]==='lo') cls=' hl';
    else if(marks[i]==='hi') cls=' hl2';
    else if(marks[i]==='mid') cls=' hl3';
    else if(marks[i]==='found') cls=' hl4';
    return`<div class="arr-cell"><div class="arr-box${cls}">${v}</div><div class="arr-idx">[${i}]</div></div>`;
  }).join('');
}
function runBS(){
  const t=parseInt(document.getElementById('bsTarget').value);
  if(isNaN(t)){document.getElementById('bsLog').textContent='⚠ Target value daalo!';return;}
  let lo=0,hi=bsData.length-1,steps=0,found=-1;
  let log=`Binary Search: target=${t}\n`;
  while(lo<=hi){
    steps++;
    const mid=lo+Math.floor((hi-lo)/2);
    log+=`Step ${steps}: lo=${lo}, mid=${mid}, hi=${hi}, arr[mid]=${bsData[mid]}  →  `;
    if(bsData[mid]===t){found=mid;log+=`FOUND! 🎉\n`;renderBSArr({[lo]:'lo',[hi]:'hi',[mid]:'found'});break;}
    else if(bsData[mid]<t){log+=`${bsData[mid]}<${t}, go right\n`;lo=mid+1;}
    else{log+=`${bsData[mid]}>${t}, go left\n`;hi=mid-1;}
    renderBSArr({[lo]:'lo',[hi]:'hi',[mid]:'mid'});
  }
  if(found===-1)log+=`Not found after ${steps} steps.`;
  document.getElementById('bsLog').textContent=log;
}
function runLinear(){
  const t=parseInt(document.getElementById('bsTarget').value);
  if(isNaN(t)){document.getElementById('bsLog').textContent='⚠ Value daalo!';return;}
  let marks={};
  for(let i=0;i<bsData.length;i++){
    if(bsData[i]===t){marks[i]='found';break;}
    marks[i]='lo';
  }
  renderBSArr(marks);
  const idx=bsData.indexOf(t);
  document.getElementById('bsLog').textContent=idx>=0?`Linear: Scanned ${idx+1} elements, found at [${idx}]. Binary would take ${Math.ceil(Math.log2(bsData.length))} steps!`:`Linear: Scanned all ${bsData.length} elements, not found.`;
}
function resetBS(){renderBSArr();document.getElementById('bsLog').textContent='// Value daalo aur search karo';}
renderBSArr();

// ═══ SORT VISUALIZER ═══
let sortArr=[64,34,25,12,22,11,90,42];
let sortTimer=null;
function renderSortBars(highlights={}){
  const el=document.getElementById('sortBars');
  const max=Math.max(...sortArr);
  el.innerHTML=sortArr.map((v,i)=>{
    let cls='sort-bar';
    if(highlights[i]==='a') cls+=' active';
    else if(highlights[i]==='s') cls+=' sorted';
    else if(highlights[i]==='c') cls+=' comparing';
    else if(highlights[i]==='p') cls+=' pivot';
    const h=Math.round((v/max)*90)+10;
    return`<div class="${cls}" style="height:${h}%;" title="${v}"></div>`;
  }).join('');
}
function resetSort(){
  if(sortTimer)clearTimeout(sortTimer);
  sortArr=[64,34,25,12,22,11,90,42];
  renderSortBars();
  document.getElementById('sortLog').textContent='// Sort algo select karo aur Start dabao';
}
async function startSort(){
  if(sortTimer)clearTimeout(sortTimer);
  sortArr=[64,34,25,12,22,11,90,42];
  const algo=document.getElementById('sortAlgo').value;
  const delay=()=>new Promise(r=>{sortTimer=setTimeout(r,1000-parseInt(document.getElementById('sortSpeed').value)+100);});
  const log=document.getElementById('sortLog');
  const arr=[...sortArr];
  if(algo==='bubble'){
    log.textContent='Bubble Sort: Larger elements "bubble up" to end';
    const n=arr.length;
    for(let i=0;i<n-1;i++){
      for(let j=0;j<n-i-1;j++){
        sortArr=[...arr];renderSortBars({[j]:'a',[j+1]:'c'});await delay();
        if(arr[j]>arr[j+1]){[arr[j],arr[j+1]]=[arr[j+1],arr[j]];log.textContent=`Swap ${arr[j+1]} and ${arr[j]}`;}
      }
    }
    sortArr=arr;renderSortBars(Object.fromEntries(arr.map((_,i)=>[i,'s'])));
    log.textContent='✅ Bubble Sort done!';
  } else if(algo==='selection'){
    log.textContent='Selection Sort: Find min, put at start';
    const n=arr.length;
    for(let i=0;i<n-1;i++){
      let minI=i;
      for(let j=i+1;j<n;j++){
        sortArr=[...arr];renderSortBars({[i]:'s',[minI]:'a',[j]:'c'});await delay();
        if(arr[j]<arr[minI]) minI=j;
      }
      [arr[i],arr[minI]]=[arr[minI],arr[i]];
      log.textContent=`Placed ${arr[i]} at position ${i}`;
    }
    sortArr=arr;renderSortBars(Object.fromEntries(arr.map((_,i)=>[i,'s'])));
    log.textContent='✅ Selection Sort done!';
  } else {
    log.textContent='Insertion Sort: Build sorted array one by one';
    const n=arr.length;
    for(let i=1;i<n;i++){
      const key=arr[i]; let j=i-1;
      while(j>=0&&arr[j]>key){
        arr[j+1]=arr[j];
        sortArr=[...arr];renderSortBars({[j]:'c',[j+1]:'a'});await delay();
        j--;
      }
      arr[j+1]=key;
      log.textContent=`Inserted ${key} at position ${j+1}`;
    }
    sortArr=arr;renderSortBars(Object.fromEntries(arr.map((_,i)=>[i,'s'])));
    log.textContent='✅ Insertion Sort done!';
  }
}
renderSortBars();

// ═══ KADANE'S SIMULATOR ═══
const kadArr=[-2,1,-3,4,-1,2,1,-5,4];
let kadIdx=0,kadCur=0,kadBest=-Infinity,kadStart=0,kadEnd=0,kadBestStart=0,kadBestEnd=0,kadTmp=0;
function renderKadane(hl=-1){
  const el=document.getElementById('kadaneArr');
  el.innerHTML=kadArr.map((v,i)=>{
    let cls='arr-box';
    if(i>=kadBestStart&&i<=kadBestEnd&&kadBest>-Infinity) cls+=' hl2';
    if(i===hl) cls+=' hl';
    return`<div class="arr-cell"><div class="${cls}">${v}</div><div class="arr-idx">[${i}]</div></div>`;
  }).join('');
  document.getElementById('kadCur').textContent=kadCur===0&&kadIdx===0?'0':kadCur;
  document.getElementById('kadMax').textContent=kadBest===-Infinity?'-∞':kadBest;
  document.getElementById('kadWin').textContent=kadBest>-Infinity?`[${kadBestStart}..${kadBestEnd}]`:'-';
}
function kadaneStep(){
  if(kadIdx>=kadArr.length){document.getElementById('kadaneLog').textContent=`Done! Max sum = ${kadBest}, window = arr[${kadBestStart}..${kadBestEnd}]`;return;}
  const x=kadArr[kadIdx];
  if(kadIdx===0){kadCur=x;kadBest=x;kadBestStart=kadBestEnd=0;}
  else{
    if(kadCur+x>x){kadCur+=x;kadEnd=kadIdx;}
    else{kadCur=x;kadStart=kadEnd=kadIdx;}
    if(kadCur>kadBest){kadBest=kadCur;kadBestStart=kadStart;kadBestEnd=kadEnd;}
  }
  document.getElementById('kadaneLog').textContent=`[${kadIdx}] val=${x}: cur=max(${x}, ${kadIdx===0?x:kadArr[kadIdx-1]}+${x})=${kadCur}  best=${kadBest}`;
  renderKadane(kadIdx);
  kadIdx++;
}
function kadaneReset(){kadIdx=0;kadCur=0;kadBest=-Infinity;kadStart=0;kadEnd=0;kadBestStart=0;kadBestEnd=0;renderKadane();document.getElementById('kadaneLog').textContent='// Step by step Kadane\'s algorithm';document.getElementById('kadCur').textContent='0';document.getElementById('kadMax').textContent='-∞';document.getElementById('kadWin').textContent='-';}
let kadAutoTimer=null;
function kadaneAuto(){
  if(kadAutoTimer)clearInterval(kadAutoTimer);
  kadaneReset();
  kadAutoTimer=setInterval(()=>{
    if(kadIdx>=kadArr.length){clearInterval(kadAutoTimer);return;}
    kadaneStep();
  },700);
}
renderKadane();

// ═══ QUIZ ═══
let qDone=new Array(8).fill(false),qScore=0;
function qa(btn,type,explain){
  const card=btn.closest('.quiz-card');
  const idx=[...document.querySelectorAll('.quiz-card')].indexOf(card);
  if(qDone[idx])return;
  qDone[idx]=true;
  btn.classList.add(type);
  card.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  const ex=document.getElementById('qe'+idx);
  ex.textContent=explain;ex.classList.add('show');
  if(type==='correct')qScore++;
  const done=qDone.filter(Boolean).length;
  document.getElementById('qprog').style.width=(done/8*100)+'%';
  if(done===8){
    const sc=document.getElementById('scoreCard');sc.style.display='block';
    document.getElementById('scoreBig').textContent=qScore+'/8';
    const msgs=['Basics solid karo pehle!','Keep going!','Theek hai — practice karo!','Accha hai!','Bahut accha!','Almost perfect!','Excellent!','🏆 Array Master!'];
    document.getElementById('scoreMsg').textContent=msgs[qScore]||'';
  }
}
function resetQuiz(){
  qDone=new Array(8).fill(false);qScore=0;
  document.querySelectorAll('.quiz-opt').forEach(b=>{b.classList.remove('correct','wrong');b.disabled=false;});
  document.querySelectorAll('.quiz-exp').forEach(e=>{e.classList.remove('show');e.textContent='';});
  document.getElementById('qprog').style.width='0%';
  document.getElementById('scoreCard').style.display='none';
}
