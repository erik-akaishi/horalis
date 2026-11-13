/* Horalis — site.js: calculadora, FAQ, menu, diagnóstico (demonstração), posters em halftone */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header com borda ao rolar */
const head=document.querySelector('.site-head');
addEventListener('scroll',()=>head.classList.toggle('scrolled',scrollY>8),{passive:true});

/* FAQ + JSON-LD */
const FAQ=[
 ['É só um sistema de ponto?','Não. O ponto é o registro. A Horalis conecta ponto, férias e benefícios e cuida do que vem depois: resolve cada evento quando ele acontece para que o fechamento da folha vire conferência.'],
 ['Já tenho um sistema de ponto. Por que trocar?','Porque o problema não está em registrar a batida, e sim em fechar o mês sem retrabalho. Se o seu dia 30 ainda tem caça a erros, o sistema atual resolve só a primeira parte.'],
 ['Os sistemas grandes não fazem mais pelo mesmo preço?','Fazem mais do que um DP de 1 a 3 pessoas usa, e cobram por módulo. A Horalis cobra por faixa de funcionários, com tudo incluso, para empresas de 50 a 300 pessoas.'],
 ['Trocar de sistema no meio do ano dá trabalho?','A implantação é feita para DP enxuto, em cerca de 3 semanas, e começa a valer no próximo fechamento. A gente importa funcionários, jornadas e benefícios com você.'],
 ['E se der problema justo no dia do fechamento?','Existe um plantão de suporte do dia 28 ao dia 5, com gente que entende de folha respondendo rápido.'],
 ['A folha sai no formato da minha contabilidade?','Sim. O fechamento conferido gera o arquivo no formato do sistema de folha que a sua contabilidade usa.']
];

/* Calculadora */
const $=id=>document.getElementById(id);
const brl=v=>'R$ '+Math.round(v).toLocaleString('pt-BR');
function calc(){
  const n=k=>Math.max(0,parseFloat($(k).value.replace(',','.'))||0);
  const func=n('c-func'),dp=Math.max(1,n('c-dp')),horas=n('c-horas'),custo=n('c-custo'),ben=n('c-ben');
  const hDev=horas*0.5, mes=hDev*custo+ben;
  $('o-mes').textContent=brl(mes);$('o-ano').textContent=brl(mes*12);
  $('o-horas').textContent=(Math.round(hDev*10)/10).toLocaleString('pt-BR')+' h/mês';
  const r=Math.round(func/dp);$('o-ratio').textContent=`${r} hoje · até ${Math.round(r*2.5)}`;
  const plan=func<=100?1:func<=200?2:func<=300?3:0;
  $('o-faixa').textContent=func<50?'Abaixo de 50: fale com a gente':plan?['50 a 100','101 a 200','201 a 300'][plan-1]:'Acima de 300: fale com a gente';
  document.querySelectorAll('.plan').forEach(p=>p.classList.toggle('pick',+p.dataset.plan===plan&&func>=50));
  const fx=document.getElementById('dx-faixa');if(fx&&plan)fx.value=['50 a 100','101 a 200','201 a 300'][plan-1];
}
document.getElementById('calc').addEventListener('input',calc);
document.getElementById('calc').addEventListener('submit',e=>e.preventDefault());
calc();



/* Comparativo em cards no celular */
(function(){const t=document.querySelector('.cmp');if(!t)return;
 const heads=[...t.querySelectorAll('thead th')].slice(1),rows=[...t.querySelectorAll('tbody tr')];
 const order=[1,0,2],box=document.createElement('div');box.className='cmp-cards';
 order.forEach(ci=>{const h=heads[ci];const card=document.createElement('article');card.className='cmp-card'+(h.classList.contains('hl')?' hl':'');
  card.innerHTML='<h3>'+h.innerHTML+'</h3><dl>'+rows.map(r=>'<div><dt>'+r.querySelector('th').textContent+'</dt><dd>'+r.querySelectorAll('td')[ci].querySelector('.cell').innerHTML+'</dd></div>').join('')+'</dl>';
  box.appendChild(card);});
 t.closest('.cmp-wrap').after(box);})();


/* Menu mobile */
(function(){const b=document.querySelector('.burger'),m=document.getElementById('mnav');if(!b)return;
 const set=o=>{b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');m.hidden=!o;};
 b.addEventListener('click',()=>set(m.hidden));
 m.querySelectorAll('a:not([data-open])').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();set(false);requestAnimationFrame(()=>{t.scrollIntoView({behavior:reduce?'auto':'smooth'});history.replaceState(null,'',a.getAttribute('href'));});}));
 m.querySelectorAll('a[data-open]').forEach(a=>a.addEventListener('click',()=>set(false)));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden){set(false);b.focus();}});
 matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)set(false);});})();

/* Logo: volta ao topo */
document.querySelectorAll('a.logo').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});history.replaceState(null,'',location.pathname);const s=document.querySelector('.skip');if(s)s.focus({preventScroll:true});}));

/* Appear ao rolar: um observer, stagger entre irmãos */
(function(){window.__rv=1;
 const els=[...document.querySelectorAll('.rv,.rv-kids > li')];
 const groups=new Map();els.forEach(e=>{const p=e.parentElement;const i=groups.get(p)||0;groups.set(p,i+1);e.style.setProperty('--d',Math.min(i*.1,.5)+'s');});
 if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
 els.forEach(e=>io.observe(e));})();

/* Modal de diagnóstico */
const dx=document.getElementById('dx'),fw=document.getElementById('dx-form-wrap'),done=document.getElementById('dx-done');
function openDx(faixa){
  fw.hidden=false;done.hidden=true;document.getElementById('dx-err').textContent='';
  if(faixa)document.getElementById('dx-faixa').value=faixa;
  if(dx.showModal){dx.showModal();}else{dx.setAttribute('open','');}
  setTimeout(()=>document.getElementById('dx-nome').focus(),30);
}
document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openDx(a.dataset.faixa);}));
dx.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>dx.close?dx.close():dx.removeAttribute('open')));
dx.addEventListener('click',e=>{if(e.target===dx)dx.close();});
document.getElementById('dx-form').addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('dx-nome').value.trim(),email=document.getElementById('dx-email').value.trim(),err=document.getElementById('dx-err');
  if(!nome){err.textContent='Escreva o seu nome para a gente saber com quem falar.';document.getElementById('dx-nome').focus();return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='Confira o e-mail: ele precisa ter o formato nome@empresa.com.br.';document.getElementById('dx-email').focus();return;}
  fw.hidden=true;done.hidden=false;
  document.getElementById('dx-done-title').innerHTML='Pedido registrado, '+nome.split(' ')[0].replace(/[<>&]/g,'')+'<span class="dot">.</span>';
});

/* Posters em halftone + riso */
function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function setup(cv){const r=cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.max(1,r.width*dpr);cv.height=Math.max(1,r.height*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return [c,r.width,r.height];}
let NOISE;function grain(c,w,h,a){if(!NOISE){NOISE=document.createElement('canvas');NOISE.width=NOISE.height=96;const n=NOISE.getContext('2d'),g=rng(9);for(let i=0;i<700;i++){n.fillStyle=g()<.5?'#000':'#fff';n.fillRect(g()*96,g()*96,1,1);}}c.save();c.globalAlpha=a;c.fillStyle=c.createPattern(NOISE,'repeat');c.fillRect(0,0,w,h);c.restore();}
function sphere(c,cx,cy,R,ink,cell,inv){
  c.fillStyle=ink;
  for(let y=cy-R;y<=cy+R;y+=cell)for(let x=cx-R;x<=cx+R;x+=cell){
    const px=x-cx,py=y-cy,dd=Math.hypot(px,py)/R;if(dd>1)continue;
    const nz=Math.sqrt(1-dd*dd);let l=Math.min(1,Math.max(0,(px/R*.5+py/R*.6)*.8+nz*.35+.15));
    let k=inv?1-l:l;const r=cell*.6*Math.min(1,k*.9+.12);if(r<.5)continue;
    c.beginPath();c.arc(x,y,r,0,7);c.fill();}
}
function flat(c,cx,cy,R,col,cell,rad){c.fillStyle=col;for(let y=cy-R;y<=cy+R;y+=cell)for(let x=cx-R;x<=cx+R;x+=cell){if(Math.hypot(x-cx,y-cy)>R)continue;c.beginPath();c.arc(x,y,rad,0,7);c.fill();}}
const DRAW={
  sphere(cv){const[c,w,h]=setup(cv);c.fillStyle='#1B2230';c.fillRect(0,0,w,h);
    const R=w*.36;sphere(c,w*.44,h*.45,R,'#F3EFE6',Math.max(6,w/48),true);
    c.globalCompositeOperation='screen';flat(c,w*.66+3,h*.62+2,R*.42,'#E0715B',Math.max(5,w/62),Math.max(1.6,w/190));c.globalCompositeOperation='source-over';grain(c,w,h,.05);},
  thirty(cv){const[c,w,h]=setup(cv);c.fillStyle='#1B2230';c.fillRect(0,0,w,h);
    const m=document.createElement('canvas');m.width=Math.round(w);m.height=Math.round(h);const g=m.getContext('2d');
    g.fillStyle='#000';g.font=`600 ${w*.62}px "Instrument Sans", sans-serif`;g.textBaseline='middle';g.textAlign='center';g.fillText('30',w*.5,h*.44);
    const d=g.getImageData(0,0,m.width,m.height).data,cell=Math.max(6,w/46);c.fillStyle='#F3EFE6';
    for(let y=cell/2;y<h;y+=cell)for(let x=cell/2;x<w;x+=cell){const i=(Math.round(y)*m.width+Math.round(x))*4;if(d[i+3]>100){c.beginPath();c.arc(x,y,cell*.38,0,7);c.fill();}}
    c.save();c.translate(w*.62,h*.6);c.rotate(-.12);c.strokeStyle='#E0715B';c.lineWidth=2.5;const bw=w*.4,bh=w*.1;c.strokeRect(-bw/2,-bh/2,bw,bh);
    c.fillStyle='#E0715B';c.font=`500 ${w*.052}px "IBM Plex Mono", monospace`;c.textAlign='center';c.textBaseline='middle';c.fillText('CONFERIDO',0,2);c.restore();grain(c,w,h,.05);},
  ruler(cv){const[c,w,h]=setup(cv);c.fillStyle='#F3EFE6';c.fillRect(0,0,w,h);
    const x0=w*.05,x1=w*.95,y=h*.66,n=16,step=(x1-x0)/(n-1);
    c.strokeStyle='#1B2230';c.lineWidth=2;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
        for(let i=0;i<n;i++){const x=x0+i*step,band=i>=6&&i<=9,R=Math.min(step*.46,h*.05+i*h*.012);
      const cell=Math.max(4,R/4.2);for(let yy=-R;yy<=R;yy+=cell)for(let xx=-R;xx<=R;xx+=cell){if(Math.hypot(xx,yy)>R)continue;c.fillStyle=band?'#B8432F':'#1B2230';c.beginPath();c.arc(x+xx+(band?2:0),y-R-10+yy+(band?1:0),cell*.32,0,7);c.fill();}}
    c.font=`500 ${Math.max(11,w/90)}px "IBM Plex Mono", monospace`;c.textBaseline='top';const ty=y+12;
    c.fillStyle='#5A606B';c.textAlign='left';c.fillText('10 · PLANILHA',x0,ty);c.textAlign='right';c.fillText('ERP · 1.000+',x1,ty);
    c.fillStyle='#B8432F';c.textAlign='center';c.fillText('50 – 300 · HORALIS',x0+step*7.5,ty);grain(c,w,h,.04);}
};
const drawn=new WeakSet();
function draw(cv){DRAW[cv.dataset.poster](cv);drawn.add(cv);}
const ready=new Promise(r=>{const go=()=>setTimeout(r,2500);document.readyState==='complete'?go():addEventListener('load',go,{once:true});}).then(()=>document.fonts&&document.fonts.ready);
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);ready.then(()=>(window.requestIdleCallback||setTimeout)(()=>draw(e.target),{timeout:1200}));}}),{rootMargin:'300px'}):null;
document.querySelectorAll('canvas[data-poster]').forEach(cv=>io?io.observe(cv):ready.then(()=>draw(cv)));
let t,lastW=innerWidth;addEventListener('resize',()=>{if(innerWidth===lastW)return;lastW=innerWidth;clearTimeout(t);t=setTimeout(()=>document.querySelectorAll('canvas[data-poster]').forEach(cv=>{if(drawn.has(cv))draw(cv);}),200);});
})();
