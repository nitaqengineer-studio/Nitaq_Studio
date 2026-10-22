/* NITAQ · صور المشروع المشتركة.
   ارفع الأصل والنتيجة مرة واحدة (في مساحة العمل أو في «مقارنة النتيجة»)، ثم استخدمهما في أي أداة بزر واحد:
   مقارنة النتيجة · مدار الكاميرا · محرر الأسماء والأبعاد · ورقة المخططات.
   الصور تبقى في ذاكرة الصفحة فقط ولا تُرسل لأي خدمة، وتضيع بإعادة التحميل مثل باقي الأدوات.
   لا يغيّر منطق الأدوات: يضع الملف في نفس حقل الرفع الموجود ويطلق حدث change كما لو اختاره المستخدم. */
(()=>{
const store={source:null,result:null};
window.NITAQ_PROJECT_IMAGES=store;
const LABEL={source:'الأصل',result:'النتيجة'};

/* ---------- التقاط الرفع ---------- */
const CAPTURE=[
  ['#nqrSourceFile','source'],
  ['#nqrResultFile','result'],
];
let filling=false;
document.addEventListener('change',e=>{
  if(filling)return;
  const t=e.target;if(!(t instanceof HTMLInputElement)||t.type!=='file'||!t.files||!t.files[0])return;
  for(const [sel,key] of CAPTURE){if(t.matches(sel)){set(key,t.files[0]).catch(()=>{});break;}}
},true);
const revisions={source:0,result:0};
async function validate(file){if(!(file instanceof Blob)||!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>30000000)throw Error('اختر PNG أو JPEG أو WebP حتى 30 MB.');const im=await createImageBitmap(file);const dimensions={w:im.width,h:im.height};im.close();if(dimensions.w*dimensions.h>45000000)throw Error('الصورة أكبر من 45 مليون بكسل.');return dimensions;}
async function set(key,file){if(!(key in revisions))throw Error('دور صورة غير صالح');const rev=++revisions[key];try{await validate(file);if(rev!==revisions[key])return false;store[key]=file;window.dispatchEvent(new CustomEvent('nitaq-project-images'));refreshAll();return true;}catch(e){if(rev===revisions[key])window.dispatchEvent(new CustomEvent('nitaq-image-error',{detail:e.message}));throw e;}}
window.NITAQ_IMAGES={set,validate,async replace(files){for(const key of ['source','result'])if(files[key])await validate(files[key]);for(const key of ['source','result']){revisions[key]++;store[key]=files[key]||null;}window.dispatchEvent(new CustomEvent('nitaq-project-images'));refreshAll();}};

/* ---------- وضع الملف في حقل أداة ---------- */
function put(input,file){
  if(!input||!file)return false;
  const win=input.ownerDocument.defaultView;
  const dt=new win.DataTransfer();dt.items.add(file);
  filling=true;try{input.files=dt.files;input.dispatchEvent(new win.Event('change',{bubbles:true}));}finally{filling=false;}
  return true;
}

/* ---------- زر «استخدم صور المشروع» ---------- */
const CSS=`.nqUse{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:6px 0 10px;padding:7px 10px;border:1px dashed #C9A25D;border-radius:8px;background:#F7F1E4;font:inherit;font-size:12.5px;color:#101725}
.nqUse[hidden]{display:none!important}
.nqUse button{font:inherit;font-size:12.5px;font-weight:500;border:1px solid #101725!important;background:#101725!important;color:#fff!important;border-radius:6px;padding:5px 12px;cursor:pointer;width:auto!important;margin:0!important}
.nqUse button:hover{background:#1C2536}
.nqUse span{color:#6E7787;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1;direction:ltr;unicode-bidi:plaintext;text-align:right}`;
function ensureStyle(doc){if(doc.getElementById('nq-use-style'))return;const s=doc.createElement('style');s.id='nq-use-style';s.textContent=CSS;(doc.head||doc.documentElement).append(s);}
const bars=new Set();
/* targets: [[input, key], ...]  — يضع كل صورة متاحة في حقلها */
function addBar(doc,anchor,targets,where='before',text){
  if(!anchor||anchor.dataset.nqBar||anchor.previousElementSibling?.classList?.contains('nqUse')||anchor.nextElementSibling?.classList?.contains('nqUse'))return;
  anchor.dataset.nqBar='1';
  ensureStyle(doc);
  const bar=doc.createElement('div');bar.className='nqUse';bar.setAttribute('role','group');
  const b=doc.createElement('button');b.type='button';b.textContent=text||'استخدم صور المشروع';
  const info=doc.createElement('span');
  b.onclick=()=>{let n=0;for(const [input,key] of targets){const el=typeof input==='function'?input():input;if(store[key]&&put(el,store[key]))n++;}info.textContent=n?'تم وضع صور المشروع ✓':'لا توجد صورة مناسبة بعد';};
  bar.append(b,info);bar._targets=targets;bar._info=info;
  anchor[where==='before'?'before':'after'](bar);bars.add(bar);refresh(bar);
}
function refresh(bar){
  if(!bar.isConnected){bars.delete(bar);return;}
  const keys=[...new Set(bar._targets.map(t=>t[1]))].filter(k=>store[k]);
  bar.hidden=!keys.length;
  bar._info.textContent=keys.map(k=>`${LABEL[k]}: ${store[k].name}`).join(' — ');
}
function refreshAll(){bars.forEach(refresh);postAll();}

/* ---------- ربط الأدوات ---------- */
function wireReview(){
  const s=document.getElementById('nqrSourceFile'),r=document.getElementById('nqrResultFile');
  if(!s||!r)return;
  addBar(document,s.closest('.nqrPair'),[[s,'source'],[r,'result']],'before');
}
function wireFrame(f){
  let doc;try{doc=f.contentDocument;}catch{return;}
  if(!doc||!doc.body)return;
  const title=f.getAttribute('title')||'';
  if(title.includes('مدار الكاميرا')){
    const inp=doc.getElementById('file');if(inp)addBar(doc,inp,[[inp,'source']],'after','استخدم أصل المشروع');
  }
}
/* صفحات مستقلة (المخططات): قد تكون من أصل آخر عند فتح الاستديو من المجلد، فنرسل لها الصور برسالة؛
   والصفحة نفسها (assets/nitaq-embed.js) تُظهر زر «استخدم صور المشروع». */
function postImages(f){try{f.contentWindow&&f.contentWindow.postMessage({nqEmbed:true,type:'images',source:store.source,result:store.result},'*');}catch{}}
function postAll(){document.querySelectorAll('iframe').forEach(f=>{if(!/مدار الكاميرا/.test(f.getAttribute('title')||''))postImages(f);});}
window.addEventListener('message',e=>{const d=e.data;if(!d||d.nqEmbed!==true||d.type!=='ready')return;const f=[...document.querySelectorAll('iframe')].find(x=>x.contentWindow===e.source);if(f&&(store.source||store.result))postImages(f);});
function scanFrames(){document.querySelectorAll('iframe').forEach(f=>{if(!f.dataset.nqUse){f.dataset.nqUse='1';f.addEventListener('load',()=>wireFrame(f));}wireFrame(f);});}
wireReview();scanFrames();
new MutationObserver(()=>{wireReview();scanFrames();}).observe(document.body,{childList:true,subtree:true});
})();
