/* NITAQ · صفحة مضمّنة داخل الاستديو (المخططات، المكتب الفني).
   يعمل سواء فُتح الاستديو من خادم أو مباشرة من المجلد (file://)، حيث لا يستطيع الاستديو الوصول لمحتوى الإطار.
   لذلك تتكفل الصفحة بنفسها بـ:
   - تنسيقها داخل الاستديو (html.nq-embedded) وتخطيط اللوحة الثابتة (html.nq-dock) حين يطلبه الاستديو.
   - إبلاغ الاستديو بارتفاعها على الشاشات الصغيرة ليتمدد الإطار بطولها (تمرير واحد للصفحة).
   - استقبال «صور المشروع» من الاستديو وإظهار زر «استخدم صور المشروع» بجوار حقول الرفع.
   كل الرسائل مع window.parent فقط. منفردةً تعمل الصفحة كما هي. */
(()=>{
const root=document.documentElement;
let embedded=false;try{embedded=window.top!==window;}catch{embedded=true;}
if(!embedded)return;
root.classList.add('nq-embedded');
const parentWin=window.parent;
const send=msg=>{try{parentWin.postMessage(Object.assign({nqEmbed:true},msg),'*');}catch{}};

/* ---------- Ctrl+K داخل الصفحة يفتح بحث الاستديو ---------- */
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&(e.key==='k'||e.key==='K'||e.code==='KeyK')){e.preventDefault();send({type:'palette'});}});

/* ---------- الارتفاع ---------- */
let dock=false,lastH=0;
function report(){
  if(dock)return;
  const h=Math.ceil(Math.max(document.body.scrollHeight,document.body.getBoundingClientRect().height))+4;
  if(Math.abs(h-lastH)>2){lastH=h;send({type:'height',h});}
}
if(window.ResizeObserver)new ResizeObserver(report).observe(document.body);
window.addEventListener('load',report);

/* ---------- صور المشروع ---------- */
const store={source:null,result:null},LABEL={source:'الأصل',result:'النتيجة'},bars=new Set();
function put(input,file){if(!input||!file)return false;const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true;}
function addBar(anchor,targets,text,where){
  if(!anchor||anchor.parentNode.querySelector(':scope > .nqUse[data-for="'+targets.map(t=>t[0]&&t[0].id).join(',')+'"]'))return;
  const bar=document.createElement('div');bar.className='nqUse';bar.dataset.for=targets.map(t=>t[0]&&t[0].id).join(',');
  const b=document.createElement('button');b.type='button';b.textContent=text||'استخدم صور المشروع';
  const info=document.createElement('span');
  b.onclick=()=>{let n=0;for(const [el,key] of targets)if(store[key]&&put(el,store[key]))n++;info.textContent=n?'تم وضع صور المشروع ✓':'لا توجد صورة مناسبة بعد';};
  bar.append(b,info);bar._targets=targets;bar._info=info;
  anchor[where||'after'](bar);bars.add(bar);refresh(bar);
}
function refresh(bar){const keys=[...new Set(bar._targets.map(t=>t[1]))].filter(k=>store[k]);bar.hidden=!keys.length;bar._info.textContent=keys.map(k=>`${LABEL[k]}: ${store[k].name}`).join(' — ');}
function wire(){
  const plan=document.getElementById('planFile');
  if(plan)addBar(plan.closest('label')||plan,[[plan,'result']],'استخدم نتيجة المشروع');
  const tx=document.getElementById('txFile'),orig=document.getElementById('txOriginal');
  if(tx)addBar(tx.closest('.txCard')?.querySelector('h3')||tx,[[tx,'result'],[orig,'source']]);
}

window.addEventListener('message',e=>{
  if(e.source!==parentWin||!e.data||e.data.nqEmbed!==true)return;
  const d=e.data;
  if(d.type==='text-session-export'&&window.NITAQ_TEXT_SESSION){window.NITAQ_TEXT_SESSION.export().then(value=>send({type:'text-session-response',id:d.id,value})).catch(err=>send({type:'text-session-response',id:d.id,error:err.message}));}
  if(d.type==='text-session-restore'&&window.NITAQ_TEXT_SESSION){window.NITAQ_TEXT_SESSION.restore(d.value).then(()=>send({type:'text-session-response',id:d.id,value:true})).catch(err=>send({type:'text-session-response',id:d.id,error:err.message}));}
  if(d.type==='mode'){dock=!!d.dock;root.classList.toggle('nq-dock',dock);if(!dock){lastH=0;report();}}
  if(d.type==='images'){
    for(const k of ['source','result'])store[k]=d[k]&&/^image\//.test(d[k].type||'')?d[k]:null;
    wire();bars.forEach(refresh);
  }
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{wire();send({type:'ready'});});
else{wire();send({type:'ready'});}
})();
