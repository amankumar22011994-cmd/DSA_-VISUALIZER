
// ═══ NAV ═══
function S(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(btn)btn.classList.add('active');
}

// ═══ COPY ═══
function cp(btn){
  let pre=btn.parentElement.querySelector('pre')||btn.closest('.card')?.querySelector('pre')||btn.closest('.lc-card')?.querySelector('pre')||btn.closest('.pat-card')?.querySelector('pre');
  if(!pre)return;
  navigator.clipboard.writeText(pre.innerText.trim()).then(()=>{
    btn.textContent='✓ copied';btn.classList.add('ok');
    setTimeout(()=>{btn.textContent='copy';btn.classList.remove('ok');},1800);
  });
}

// ═══ SOLUTION TABS ═══
function tabSwitch(btn,panelId){
  const card=btn.closest('.lc-card');
  card.querySelectorAll('.sol-tab').forEach(t=>t.classList.remove('active'));
  card.querySelectorAll('.sol-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

// ═══ BASE MATRIX ═══
const baseData=[[1,2,3,4],[5,6,7,8],[9,10,11,12]];
function renderBase(hl=[-1,-1]){
  const el=document.getElementById('baseMat');
  el.innerHTML=baseData.map((row,i)=>row.map((v,j)=>`<div class="mat-cell${(i===hl[0]&&j===hl[1])?' mc-hl':''}">${v}</div>`).join('')).join('');
}
function accessCell(){
  const r=parseInt(document.getElementById('bRow').value),c=parseInt(document.getElementById('bCol').value);
  if(isNaN(r)||isNaN(c)||r<0||r>2||c<0||c>3){document.getElementById('baseLog').textContent='⚠ Row: 0-2, Col: 0-3 ke beech daalo!';return;}
  renderBase([r,c]);
  document.getElementById('baseLog').textContent=`mat[${r}][${c}] = ${baseData[r][c]}  →  Address = base + (${r}×4 + ${c})×4 = base + ${(r*4+c)*4} bytes`;
}
function resetBase(){renderBase();document.getElementById('baseLog').textContent='// mat[row][col] = value — O(1) access';}
renderBase();

// ═══ MEMORY LAYOUT ═══
(function(){
  const data=[1,2,3,4,5,6];
  const addrs=['0x1000','0x1004','0x1008','0x100C','0x1010','0x1014'];
  const labels=['[0][0]','[0][1]','[0][2]','[1][0]','[1][1]','[1][2]'];
  const colors=['mc-b','mc-b','mc-b','mc-g','mc-g','mc-g'];
  const el=document.getElementById('memLayout');
  el.innerHTML=data.map((v,i)=>`
    <div style="text-align:center;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);margin-bottom:3px;">${addrs[i]}</div>
      <div class="mat-cell ${colors[i]}" style="margin:0 2px;">${v}</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--accent);margin-top:3px;">${labels[i]}</div>
    </div>`).join('');
})();

// ═══ TRAVERSAL SIMULATOR ═══
const travData=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
let travTimer=null;
function renderTrav(highlights={}){
  const el=document.getElementById('travMat');
  el.innerHTML=travData.map((row,i)=>row.map((v,j)=>{
    const k=`${i},${j}`;
    let cls='mat-cell';
    if(highlights[k]==='a') cls+=' mc-hl';
    else if(highlights[k]==='b') cls+=' mc-g';
    else if(highlights[k]==='visited') cls+=' mc-b';
    return`<div class="${cls}">${v}</div>`;
  }).join('')).join('');
}
function resetTrav(){if(travTimer)clearTimeout(travTimer);renderTrav();document.getElementById('travLog').textContent='// Pattern select karo';}
async function travAnimate(type){
  if(travTimer)clearTimeout(travTimer);
  renderTrav();
  const delay=ms=>new Promise(r=>{travTimer=setTimeout(r,ms);});
  const n=4,m=4;
  let seq=[];
  if(type==='row'){for(let i=0;i<n;i++)for(let j=0;j<m;j++)seq.push([i,j]);document.getElementById('travLabel').textContent='Row-wise: left→right, top→bottom';}
  else if(type==='col'){for(let j=0;j<m;j++)for(let i=0;i<n;i++)seq.push([i,j]);document.getElementById('travLabel').textContent='Column-wise: top→bottom, left→right';}
  else if(type==='diag'){for(let i=0;i<Math.min(n,m);i++)seq.push([i,i]);document.getElementById('travLabel').textContent='Main Diagonal: mat[i][i]';}
  else if(type==='anti'){for(let i=0;i<Math.min(n,m);i++)seq.push([i,m-1-i]);document.getElementById('travLabel').textContent='Anti-Diagonal: mat[i][n-1-i]';}
  else if(type==='spiral'){
    let top=0,bot=n-1,left=0,right=m-1;
    while(top<=bot&&left<=right){
      for(let i=left;i<=right;i++)seq.push([top,i]);top++;
      for(let i=top;i<=bot;i++)seq.push([i,right]);right--;
      if(top<=bot){for(let i=right;i>=left;i--)seq.push([bot,i]);bot--;}
      if(left<=right){for(let i=bot;i>=top;i--)seq.push([i,left]);left++;}
    }
    document.getElementById('travLabel').textContent='Spiral Order: 4 boundaries shrinking';
  }
  else if(type==='zigzag'){
    for(let i=0;i<n;i++)if(i%2===0)for(let j=0;j<m;j++)seq.push([i,j]);else for(let j=m-1;j>=0;j--)seq.push([i,j]);
    document.getElementById('travLabel').textContent='Zigzag: even rows →, odd rows ←';
  }
  const visited={};
  for(let s=0;s<seq.length;s++){
    const [r,c]=seq[s];
    const k=`${r},${c}`;
    const hl={...visited};
    hl[k]='a';
    renderTrav(hl);
    document.getElementById('travLog').textContent=`Step ${s+1}: mat[${r}][${c}] = ${travData[r][c]}  (visiting sequence: ${seq.slice(0,s+1).map(([a,b])=>travData[a][b]).join('→')})`;
    await delay(200);
    visited[k]='visited';
  }
}
renderTrav();

// ═══ OPERATIONS SIMULATOR ═══
const origMat3=[[1,2,3],[4,5,6],[7,8,9]];
function renderOp(m,el,cols){
  el.style.gridTemplateColumns=`repeat(${cols},1fr)`;
  el.innerHTML=m.map(row=>row.map(v=>`<div class="mat-cell mc-hl">${v}</div>`).join('')).join('');
}
function renderOrigOp(){
  const el=document.getElementById('opOrigMat');
  el.innerHTML=origMat3.map(row=>row.map(v=>`<div class="mat-cell">${v}</div>`).join('')).join('');
}
function deepCopy(m){return m.map(r=>[...r]);}
function doOp(op){
  let m=deepCopy(origMat3);const n=m.length;
  let label='',res=[];
  if(op==='transpose'){
    res=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>m[j][i]));
    label='Transpose: mat[i][j] ↔ mat[j][i]';
  } else if(op==='rot90'){
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let t=m[i][j];m[i][j]=m[j][i];m[j][i]=t;}
    m.forEach(r=>r.reverse());
    res=m;label='Rotate 90°↻: Transpose + Reverse each row';
  } else if(op==='rot180'){
    m.forEach(r=>r.reverse());
    m.reverse();
    res=m;label='Rotate 180°: Flip H + Flip V';
  } else if(op==='rot270'){
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let t=m[i][j];m[i][j]=m[j][i];m[j][i]=t;}
    m.reverse();
    res=m;label='Rotate 90°↺: Transpose + Reverse rows';
  } else if(op==='flipH'){
    m.forEach(r=>r.reverse());
    res=m;label='Flip Horizontal: reverse each row';
  } else if(op==='flipV'){
    m.reverse();
    res=m;label='Flip Vertical: reverse row order';
  }
  document.getElementById('opResultLabel').textContent='Result';
  document.getElementById('opLabel').textContent=label;
  renderOp(res,document.getElementById('opResMat'),res[0].length);
  document.getElementById('opLog').textContent=label;
}
function resetOp(){
  document.getElementById('opResMat').innerHTML='<div class="mat-cell" style="color:var(--muted);font-size:11px;width:auto;padding:10px;">Result here</div>';
  document.getElementById('opLabel').textContent='Original 3×3 Matrix';
  document.getElementById('opLog').textContent='// Operation select karo';
}
renderOrigOp();resetOp();

// ═══ SEARCH SIMULATOR ═══
const sortedMat=[[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]];
function renderSearch(hl={}){
  const el=document.getElementById('searchMat');
  el.innerHTML=sortedMat.map((row,i)=>row.map((v,j)=>{
    const k=`${i},${j}`;
    let cls='mat-cell';
    if(hl[k]==='cur') cls+=' mc-hl';
    else if(hl[k]==='found') cls+=' mc-g';
    else if(hl[k]==='visited') cls+=' mc-p';
    return`<div class="${cls}">${v}</div>`;
  }).join('')).join('');
}
async function runSearch(){
  const t=parseInt(document.getElementById('searchTarget').value);
  if(isNaN(t)){document.getElementById('searchLog').textContent='⚠ Value daalo!';return;}
  const n=4,m=4;
  let r=0,c=m-1,steps=0;
  const visited={};
  while(r<n&&c>=0){
    const k=`${r},${c}`;
    steps++;
    if(sortedMat[r][c]===t){
      const hl={...visited,[k]:'found'};
      renderSearch(hl);
      document.getElementById('searchLog').textContent=`✅ Found ${t} at [${r}][${c}] in ${steps} steps! (O(n+m) = O(${n+m}))`;return;
    }
    const hl={...visited,[k]:'cur'};
    renderSearch(hl);
    visited[k]='visited';
    if(sortedMat[r][c]<t)r++;else c--;
    await new Promise(rr=>setTimeout(rr,350));
  }
  renderSearch(visited);
  document.getElementById('searchLog').textContent=`❌ ${t} not found in ${steps} steps.`;
}
function runLinearSearch(){
  const t=parseInt(document.getElementById('searchTarget').value);
  if(isNaN(t)){document.getElementById('searchLog').textContent='⚠ Value daalo!';return;}
  let steps=0,hl={};
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){steps++;if(sortedMat[i][j]===t){hl[`${i},${j}`]='found';renderSearch(hl);document.getElementById('searchLog').textContent=`Linear: Scanned ${steps} cells, found [${i}][${j}]. Staircase would take max ${4+4} = 8 steps.`;return;}hl[`${i},${j}`]='visited';}
  renderSearch(hl);
  document.getElementById('searchLog').textContent=`Linear: Scanned all ${steps} cells. Not found.`;
}
function resetSearch(){renderSearch();document.getElementById('searchLog').textContent='// Value daalo aur search karo';}
renderSearch();

// ═══ ISLANDS ═══
const islandGrid=[[1,1,0,0,0,0],[1,1,0,0,1,1],[0,0,0,1,1,0],[0,0,0,0,0,0],[1,0,0,1,1,0]];
let igCopy;
function resetIslands(){igCopy=islandGrid.map(r=>[...r]);renderIslands({});document.getElementById('islandLog').textContent='// DFS se connected land cells group karo';}
function renderIslands(hl={}){
  const el=document.getElementById('islandMat');
  el.innerHTML=igCopy.map((row,i)=>row.map((v,j)=>{
    const k=`${i},${j}`;
    let cls='mat-cell';
    if(v===1)cls+=' mc-g';
    else if(v===0)cls+=' mc-dim';
    if(hl[k])cls=`mat-cell mc-${hl[k]}`;
    return`<div class="${cls}">${v===1?'🌿':v===0?'~':v}</div>`;
  }).join('')).join('');
}
const islandColors=['hl','o','p','b','y','e'];
async function runIslands(){
  igCopy=islandGrid.map(r=>[...r]);
  let count=0,hl={};
  const n=igCopy.length,m=igCopy[0].length;
  async function dfs(r,c,col){
    if(r<0||r>=n||c<0||c>=m||igCopy[r][c]!==1)return;
    igCopy[r][c]=2;hl[`${r},${c}`]=islandColors[count%islandColors.length];
    renderIslands(hl);
    await new Promise(rr=>setTimeout(rr,100));
    await dfs(r-1,c,col);await dfs(r+1,c,col);await dfs(r,c-1,col);await dfs(r,c+1,col);
  }
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)if(igCopy[i][j]===1){await dfs(i,j,count);count++;}
  document.getElementById('islandLog').textContent=`✅ Found ${count} islands! Each color = one island (connected land).`;
}
resetIslands();

// ═══ 2D PREFIX SUM ═══
const pfMat=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
const pfPre=Array.from({length:5},()=>new Array(5).fill(0));
for(let i=1;i<=4;i++)for(let j=1;j<=4;j++)pfPre[i][j]=pfMat[i-1][j-1]+pfPre[i-1][j]+pfPre[i][j-1]-pfPre[i-1][j-1];
function initPF(){
  const o=document.getElementById('pfOrigMat');
  o.innerHTML=pfMat.map(r=>r.map(v=>`<div class="mat-cell">${v}</div>`).join('')).join('');
  const s=document.getElementById('pfSumMat');
  s.innerHTML=pfPre.map(r=>r.map(v=>`<div class="mat-cell" style="font-size:11px;color:var(--accent2);">${v}</div>`).join('')).join('');
}
function runPfQuery(){
  const r1=+document.getElementById('pfr1').value,c1=+document.getElementById('pfc1').value;
  const r2=+document.getElementById('pfr2').value,c2=+document.getElementById('pfc2').value;
  if(r1>r2||c1>c2||r1<0||r2>3||c1<0||c2>3){document.getElementById('pfLog').textContent='⚠ Valid range: r1≤r2, c1≤c2, all 0-3';return;}
  const ans=pfPre[r2+1][c2+1]-pfPre[r1][c2+1]-pfPre[r2+1][c1]+pfPre[r1][c1];
  const o=document.getElementById('pfOrigMat');
  o.innerHTML=pfMat.map((row,i)=>row.map((v,j)=>`<div class="mat-cell${(i>=r1&&i<=r2&&j>=c1&&j<=c2)?' mc-hl':''}">${v}</div>`).join('')).join('');
  document.getElementById('pfLog').textContent=`Query (${r1},${c1})→(${r2},${c2}): pre[${r2+1}][${c2+1}] - pre[${r1}][${c2+1}] - pre[${r2+1}][${c1}] + pre[${r1}][${c1}] = ${pfPre[r2+1][c2+1]} - ${pfPre[r1][c2+1]} - ${pfPre[r2+1][c1]} + ${pfPre[r1][c1]} = ${ans}`;
}
initPF();

// ═══ BUILDER ═══
let builderMat=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
function renderBuilder(){
  const el=document.getElementById('builderMat');
  el.style.gridTemplateColumns=`repeat(${builderMat[0].length},1fr)`;
  el.innerHTML=builderMat.map((row,i)=>row.map((v,j)=>`<div class="mat-cell" onclick="editCell(${i},${j})" style="cursor:pointer;">${v}</div>`).join('')).join('');
  document.getElementById('builderLabel').textContent=`${builderMat.length}×${builderMat[0].length} Matrix (click cells to edit)`;
}
function editCell(r,c){
  const v=prompt(`mat[${r}][${c}] ki nayi value:`,builderMat[r][c]);
  if(v!==null&&!isNaN(+v)){builderMat[r][c]=+v;renderBuilder();}
}
function builderOp(op){
  const m=builderMat.map(r=>[...r]),n=m.length;
  let res,log='';
  if(op==='transpose'){res=Array.from({length:m[0].length},(_,i)=>Array.from({length:n},(_,j)=>m[j][i]));log='Transpose done!';}
  else if(op==='rotate90'){let t=m.map(r=>[...r]);const rows=t.length,cols=t[0].length;res=Array.from({length:cols},(_,i)=>Array.from({length:rows},(_,j)=>t[rows-1-j][i]));log='Rotate 90°↻ done!';}
  else if(op==='flipH'){res=m.map(r=>[...r].reverse());log='Flip Horizontal done!';}
  else if(op==='flipV'){res=[...m].reverse();log='Flip Vertical done!';}
  else if(op==='spiral'){let top=0,bot=n-1,left=0,right=m[0].length-1,seq=[];while(top<=bot&&left<=right){for(let i=left;i<=right;i++)seq.push(m[top][i]);top++;for(let i=top;i<=bot;i++)seq.push(m[i][right]);right--;if(top<=bot){for(let i=right;i>=left;i--)seq.push(m[bot][i]);bot--;}if(left<=right){for(let i=bot;i>=top;i--)seq.push(m[i][left]);left++;}}document.getElementById('builderLog').textContent='Spiral: ['+seq.join(', ')+']';return;}
  else if(op==='diag'){const d=Array.from({length:Math.min(n,m[0].length)},(_,i)=>m[i][i]);document.getElementById('builderLog').textContent='Main diagonal: ['+d.join(', ')+']';return;}
  builderMat=res;renderBuilder();document.getElementById('builderLog').textContent=log;
}
function resetBuilder(){builderMat=[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];renderBuilder();document.getElementById('builderLog').textContent='// Reset';}
function randomize(){builderMat=builderMat.map(r=>r.map(()=>Math.floor(Math.random()*20)+1));renderBuilder();}
renderBuilder();

// ═══ QUIZ ═══
let qDone=new Array(7).fill(false),qScore=0;
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
  document.getElementById('qprog').style.width=(done/7*100)+'%';
  if(done===7){
    const sc=document.getElementById('scoreCard');sc.style.display='block';
    document.getElementById('scoreBig').textContent=qScore+'/7';
    const msgs=['Basics padhne padte hain!','Keep going!','Theek hai!','Accha!','Bahut accha!','Excellent!','🏆 Matrix Master!'];
    document.getElementById('scoreMsg').textContent=msgs[qScore]||'';
  }
}
function resetQuiz(){
  qDone=new Array(7).fill(false);qScore=0;
  document.querySelectorAll('.quiz-opt').forEach(b=>{b.classList.remove('correct','wrong');b.disabled=false;});
  document.querySelectorAll('.quiz-exp').forEach(e=>{e.classList.remove('show');e.textContent='';});
  document.getElementById('qprog').style.width='0%';
  document.getElementById('scoreCard').style.display='none';
}
