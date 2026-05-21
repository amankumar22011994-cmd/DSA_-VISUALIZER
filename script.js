

// ── CURSOR ──
const cDot = document.getElementById('cDot'), cRing = document.getElementById('cRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cDot.style.left=(mx-3)+'px'; cDot.style.top=(my-3)+'px';
});
(function animC(){
  rx+=(mx-rx-14)*.12; ry+=(my-ry-14)*.12;
  cRing.style.left=rx+'px'; cRing.style.top=ry+'px';
  requestAnimationFrame(animC);
})();
document.querySelectorAll('a,.t-card,.node').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cRing.style.width='46px';cRing.style.height='46px';cRing.style.borderColor='rgba(99,179,237,.8)';});
  el.addEventListener('mouseleave',()=>{cRing.style.width='28px';cRing.style.height='28px';cRing.style.borderColor='rgba(99,179,237,.5)';});
});

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('on'),i*90); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// ── COUNTER ANIMATION ──
const co = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num[data-target]').forEach(el=>{
      const target=+el.dataset.target, suffix=el.textContent.replace(/\d/g,'').replace('0','');
      let cur=0; const step=target/50;
      const t=setInterval(()=>{
        cur+=step; if(cur>=target){cur=target;clearInterval(t);}
        el.textContent=Math.floor(cur)+(target>=100?'+':target>10?'+':''  );
      },28);
    });
    co.unobserve(entry.target);
  });
},{threshold:.3});
document.querySelectorAll('.stats-wrap').forEach(el=>co.observe(el));
