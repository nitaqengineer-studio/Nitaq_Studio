/* Local portable project. No credentials, cloud data or remote requests. */
(()=>{
let pendingText=null;
function plansFrame(){return document.querySelector('iframe[title="المخططات والإطارات"]');}
function request(frame,type,value){return new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timer=setTimeout(()=>{window.removeEventListener('message',listen);reject(Error('لم تستجب جلسة محرر النصوص؛ افتح المخططات ثم حاول مجددًا.'));},10000);function listen(e){if(e.source!==frame.contentWindow||!e.data?.nqEmbed||e.data.id!==id||e.data.type!=='text-session-response')return;clearTimeout(timer);window.removeEventListener('message',listen);e.data.error?reject(Error(e.data.error)):resolve(e.data.value);}window.addEventListener('message',listen);frame.contentWindow.postMessage({nqEmbed:true,type,id,value},'*');});}
window.addEventListener('message',async e=>{if(!pendingText||e.source!==plansFrame()?.contentWindow||!e.data?.nqEmbed||e.data.type!=='ready')return;try{await request(plansFrame(),'text-session-restore',pendingText);pendingText=null;}catch(err){alert('تعذر استعادة محرر النصوص: '+err.message);}});
const encode=f=>new Promise((resolve,reject)=>{if(!f)return resolve(null);const r=new FileReader();r.onload=()=>resolve({name:f.name,type:f.type,data:r.result});r.onerror=()=>reject(Error('تعذر قراءة الصورة'));r.readAsDataURL(f);});
function decode(x){if(x===null)return null;if(!x||typeof x.name!=='string'||x.name.length>500||!/^image\/(png|jpeg|webp)$/.test(x.type)||typeof x.data!=='string'||x.data.length>41000000||!x.data.startsWith('data:'+x.type+';base64,'))throw Error('صورة محفوظة غير صالحة');const bytes=atob(x.data.split(',')[1]);return new File([Uint8Array.from(bytes,c=>c.charCodeAt(0))],x.name,{type:x.type});}
window.NITAQ_ARCHIVE={
 async save(){
  const core=window.NITAQ_ARCHIVE_CORE;if(!core)throw Error('انتظر اكتمال تحميل المشروع');
  const images=window.NITAQ_PROJECT_IMAGES||{};
  const textSession=pendingText||(plansFrame()?await request(plansFrame(),'text-session-export'):null);
  const data={type:'nitaq-local-project',version:1,created:new Date().toISOString(),core:core.snapshot(),workspace:window.NITAQ_WORKSPACE||{},textSession,images:{source:await encode(images.source),result:await encode(images.result)}};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='NITAQ-project-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
 },
 async restore(file){
  if(!file||file.size>280000000)throw Error('الحد الأقصى لملف المشروع 280 MB');
  const d=JSON.parse(await file.text(),(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))throw Error('مفتاح غير آمن');return v;});
  if(d?.type!=='nitaq-local-project'||d.version!==1||!d.core||!d.images||!d.workspace||typeof d.workspace.title!=='string'||typeof d.workspace.notes!=='string'||d.workspace.notes.length>200000||!['transfer','camera','plans','video','engineering'].includes(d.workspace.tool))throw Error('ملف مشروع غير متوافق');
  if(!d.core.project||typeof d.core.project!=='object'||Array.isArray(d.core.project))throw Error('إعدادات مشروع غير صالحة');
  window.NITAQ_ARCHIVE_CORE.validate(d.core);
  const images={source:decode(d.images.source),result:decode(d.images.result)};
  for(const f of Object.values(images))if(f)await window.NITAQ_IMAGES.validate(f);
  if(d.textSession&&(d.textSession.version!==2||!Array.isArray(d.textSession.items)||typeof d.textSession.image!=='string'))throw Error('جلسة نصوص غير صالحة');
  if(!confirm('استبدال صور المشروع وإعدادات الاستديو والملاحظات الحالية؟ جلسة النصوص المرفقة تُستعاد عند فتح المخططات.'))return false;
  if(d.textSession&&plansFrame())await request(plansFrame(),'text-session-restore',d.textSession);else pendingText=d.textSession||null;
  window.NITAQ_ARCHIVE_CORE.restore(d.core);
  await window.NITAQ_IMAGES.replace(images);
  window.dispatchEvent(new CustomEvent('nitaq-workspace-restore',{detail:d.workspace}));return true;
 }
};
})();
