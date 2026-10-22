/* NITAQ · مراجعة النتيجة — مراجعة بصرية بشرية، مستقلة عن واجهة React.
   القرار: أي مخالفة => Reject. صور ناقصة/مطلوب فارغ/بند غير متحقق/استثناء بلا ملاحظة => Review.
   اكتمال الفحص بلا مخالفة => Accept بصري حسب المستخدم، وليس اعتمادًا هندسيًا.
   الشكل في assets/nitaq-ui.css. */
(()=>{
if(!document.querySelector('link[data-nq-ui]')){const l=document.createElement('link');l.rel='stylesheet';l.href='assets/nitaq-ui.css';l.dataset.nqUi='1';document.head.append(l);}
const ACCEPT='image/png,image/jpeg,image/webp';
const open=document.createElement('button');open.id='nqReviewOpen';open.type='button';open.title='مراجعة النتيجة: مقارنة الأصل بالنتيجة قبل الاستخدام';
open.style.cssText='position:fixed;bottom:18px;left:18px;z-index:9990';open.innerHTML='<span class="nqIco" aria-hidden="true">✓</span><span class="nqTxt">مراجعة النتيجة</span>';document.body.append(open);
const modal=document.createElement('dialog');modal.id='nqReview';modal.setAttribute('aria-labelledby','nqrTitle');
modal.innerHTML=`
<header class="nqHead"><div><div class="nqEyebrow">QC / مراجعة بصرية</div><h2 id="nqrTitle">مراجعة النتيجة</h2></div><button id="nqrClose" type="button" class="nqIconBtn" aria-label="إغلاق">✕</button></header>
<div class="nqBody">
<p class="nqLead">مقارنة بصرية بمساعدتك، وليست فحصًا هندسيًا آليًا. لا تُحسب نسب دقة. الصور تبقى محلية ولا تُرسل لخدمة خارجية.</p>
<section class="nqStep"><h3><span class="nqNum">1</span>ما التعديل المطلوب؟</h3>
<label class="nqSr" for="nqrTask">ما التعديل المطلوب؟</label><textarea id="nqrTask" rows="2" placeholder="مثال: تغيير خامة الحجر فقط، مع ثبات المبنى والفتحات والكاميرا"></textarea></section>
<section class="nqStep"><h3><span class="nqNum">2</span>الأصل والنتيجة</h3>
<div class="nqrPair">
 <div class="nqDrop" data-key="Source"><label class="nqDropLabel"><input id="nqrSourceFile" type="file" accept="${ACCEPT}"><span class="nqDropT">الأصل</span><span class="nqDropS">اختر صورة أو اسحبها هنا</span></label><img id="nqrSource" alt="الأصل"></div>
 <div class="nqDrop" data-key="Result"><label class="nqDropLabel"><input id="nqrResultFile" type="file" accept="${ACCEPT}"><span class="nqDropT">النتيجة</span><span class="nqDropS">اختر صورة أو اسحبها هنا</span></label><img id="nqrResult" alt="النتيجة"></div>
</div>
<p id="nqrInfo" class="nqInfo" role="status">ارفع الصورتين للبدء. تغيير أي صورة أو المطلوب يعيد المراجعة إلى «لم أتحقق».</p>
<details class="nqDetails"><summary>تراكب الصورتين / للكاميرا والتأطير المتطابقين فقط</summary><p class="nqHint">المحاذاة هنا حسب حدود الصورة، وليست تسجيلًا هندسيًا. اختلاف القص أو الكاميرا قد يُظهر إزاحة لا تعني تغيّر التصميم.</p><label class="nqRange">شفافية النتيجة<input id="nqrOpacity" type="range" min="0" max="100" value="50"></label><div class="nqrOverlay"><img id="nqrBase" alt="الأصل"><img id="nqrTop" alt="النتيجة المتراكبة" style="opacity:.5"></div></details>
</section>
<section class="nqStep"><h3><span class="nqNum">3</span>قائمة المراجعة</h3>
<p class="nqHint">العناصر ثابتة افتراضيًا إلا ما طلبت تغييره. «غير منطبق» يحتاج توضيحًا في الملاحظات.</p>
<div id="nqrChecks"></div>
<label class="nqField">الملاحظات وأسباب الاختلاف أو الاستثناء<textarea id="nqrNotes" rows="2"></textarea></label>
</section>
<p class="nqFoot">التقرير لا يغيّر الصورة ولا يمنع تنزيلها من أدوات أخرى. لا تُحفظ الصور أو المراجعة بعد إعادة تحميل الصفحة؛ نزّل التقرير للاحتفاظ بقرارك.</p>
</div>
<footer class="nqBar"><p id="nqrDecision" role="status"></p><div class="nqBarBtns"><button id="nqrToQC" type="button" class="nqGhost" hidden title="يفتح سجل تقييم النتائج بنموذج مملوء من هذه المراجعة؛ تراجعه ثم تحفظه">إرسال إلى سجل التقييم</button><label class="nqGhost nqFileBtn" title="ارفع نفس الصورتين أولًا ثم اختر ملف التقرير">استعادة تقرير<input id="nqrRestore" type="file" accept="application/json"></label><button id="nqrExport" type="button" class="nqPrimary">تنزيل تقرير المراجعة</button></div></footer>`;
document.body.append(modal);
const get=id=>document.getElementById(id);
const names=['الكتلة والأدوار والسقف','مواقع وأبعاد الفتحات','الكاميرا والمنظور','حدود الخامات والعناصر غير المطلوب تغييرها','الأسماء والأبعاد والكتابة','تنفيذ التعديل المطلوب'];
const STATES=[['unknown','لم أتحقق'],['pass','مطابق'],['fail','مخالفة'],['na','غير منطبق']];
const LONG={unknown:'لم أتحقق',pass:'راجعت: مطابق للمطلوب',fail:'راجعت: توجد مخالفة',na:'غير منطبق / تغيير مطلوب'};
const slots={};let generation={};
names.forEach((name,i)=>{
  const row=document.createElement('div');row.className='nqCheck';
  const t=document.createElement('span');t.className='nqCheckName';t.id='nqrCheckName'+i;t.textContent=name;
  const s=document.createElement('select');s.id='nqrCheck'+i;s.className='nqSr';s.tabIndex=-1;s.setAttribute('aria-hidden','true');
  const seg=document.createElement('div');seg.className='nqSeg';seg.setAttribute('role','radiogroup');seg.setAttribute('aria-labelledby',t.id);
  STATES.filter(([v])=>!(i===5&&v==='na')).forEach(([v,label])=>{
    s.add(new Option(LONG[v],v));
    const b=document.createElement('button');b.type='button';b.dataset.v=v;b.textContent=label;b.setAttribute('role','radio');
    b.onclick=()=>{s.value=v;s.dispatchEvent(new Event('change'));};seg.append(b);
  });
  s.onchange=()=>{syncSeg(i);decision();};
  row.append(t,seg,s);get('nqrChecks').append(row);
});
function syncSeg(i){const s=get('nqrCheck'+i),v=s.value;s.previousElementSibling.querySelectorAll('button').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-checked',on);});s.closest('.nqCheck').dataset.state=v;}
function reset(keepNotes){names.forEach((_,i)=>{get('nqrCheck'+i).value='unknown';syncSeg(i);});if(!keepNotes)get('nqrNotes').value='';decision();}
function outcome(){const values=names.map((_,i)=>get('nqrCheck'+i).value);if(!slots.Source||!slots.Result)return ['Review','تحتاج مراجعة — ارفع الأصل والنتيجة أولًا'];if(values.includes('fail'))return ['Reject','مرفوضة حسب مراجعتك — توجد مخالفة مسجلة؛ جودة الإظهار لا تعوّضها'];if(!get('nqrTask').value.trim()||values.includes('unknown')||(values.includes('na')&&!get('nqrNotes').value.trim()))return ['Review','تحتاج مراجعة — استكمل المطلوب والفحص وأسباب الاستثناء'];return ['Accept','مقبولة بصريًا حسب مراجعتك — ليست اعتمادًا هندسيًا'];}
function showInfo(){const info=get('nqrInfo');info.textContent=Object.entries(slots).map(([k,s])=>`${k==='Source'?'الأصل':'النتيجة'}: ${s.width} × ${s.height}`).join(' — ');const a=slots.Source,b=slots.Result;if(a&&b&&Math.abs(a.width/a.height-b.width/b.height)>0.01*(a.width/a.height)){const w=document.createElement('span');w.className='nqrWarn';w.textContent=' · تنبيه: نسبة أبعاد الصورتين مختلفة؛ التراكب لن يتطابق، فاحكم بالمقارنة جنبًا لجنب. قد يدل ذلك على قص أو تغيير في التأطير.';info.append(w);}}
function decision(){const o=outcome();get('nqrDecision').textContent=o[1];get('nqrDecision').dataset.state=o[0];get('nqrExport').disabled=!slots.Source||!slots.Result;const q=get('nqrToQC');if(q){q.hidden=typeof window.NITAQ_SEND_TO_QC!=='function';q.disabled=!slots.Source||!slots.Result;}}
for(const key of ['Source','Result']){
  const input=get('nqr'+key+'File'),zone=input.closest('.nqDrop'),sub=zone.querySelector('.nqDropS');
  input.onchange=async()=>{const f=input.files[0];if(!f)return;const token=Symbol();generation[key]=token;delete slots[key];zone.classList.remove('has');reset();get('nqr'+key).removeAttribute('src');get(key==='Source'?'nqrBase':'nqrTop').removeAttribute('src');const url=URL.createObjectURL(f),im=new Image();try{await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=url;});if(generation[key]!==token){URL.revokeObjectURL(url);return;}const old=get('nqr'+key).dataset.url;if(old)URL.revokeObjectURL(old);get('nqr'+key).dataset.url=url;get('nqr'+key).src=url;get(key==='Source'?'nqrBase':'nqrTop').src=url;slots[key]={name:f.name,width:im.naturalWidth,height:im.naturalHeight};zone.classList.add('has');sub.textContent=f.name+' / اضغط للتغيير';showInfo();decision();}catch{URL.revokeObjectURL(url);sub.textContent='اختر صورة أو اسحبها هنا';get('nqrInfo').textContent='تعذر قراءة الصورة؛ اختر PNG أو JPEG أو WebP صالحًا.';decision();}};
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag');});
  zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag');const f=e.dataTransfer&&e.dataTransfer.files[0];if(!f)return;const dt=new DataTransfer();dt.items.add(f);input.files=dt.files;input.dispatchEvent(new Event('change'));});
}
get('nqrTask').oninput=()=>reset(true);get('nqrNotes').oninput=decision;get('nqrOpacity').oninput=()=>get('nqrTop').style.opacity=get('nqrOpacity').value/100;
open.onclick=()=>modal.showModal();get('nqrClose').onclick=()=>modal.close();
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
get('nqrExport').onclick=()=>{if(!slots.Source||!slots.Result)return;const report={version:1,reviewType:'manual-visual-review',date:new Date().toISOString(),requestedEdit:get('nqrTask').value,images:slots,checks:names.map((name,i)=>({name,status:get('nqrCheck'+i).value})),notes:get('nqrNotes').value,decision:outcome()[0],disclaimer:'قرار مراجعة بشرية، لا فحص هندسي آلي ولا قياس دقة.'};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='NITAQ-visual-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);};
names.forEach((_,i)=>syncSeg(i));decision();

/* ---------- إرسال إلى سجل تقييم النتائج ---------- */
const QC_MAP=[['geometry','انحراف هندسي'],['geometry','فتحات متغيرة'],['camera','كاميرا/حركة خاطئة'],['materials','خامات غير مطابقة'],['artifacts','نص أو علامة مائية'],['brief','فشل البرومبت']];
get('nqrToQC').onclick=async()=>{
  if(!slots.Source||!slots.Result||typeof window.NITAQ_SEND_TO_QC!=='function')return;
  const values=names.map((_,i)=>get('nqrCheck'+i).value),o=outcome()[0];
  const scores={};values.forEach((v,i)=>{const [k]=QC_MAP[i];if(v==='pass'||v==='fail'){const n=v==='pass'?5:1;scores[k]=k in scores?Math.min(scores[k],n):n;}});
  const failures=[...new Set(values.map((v,i)=>v==='fail'?QC_MAP[i][1]:null).filter(Boolean))];
  const lines=names.map((n,i)=>`${n}: ${LONG[values[i]]}`);
  const notes=`من «مقارنة النتيجة» (مراجعة بصرية بشرية). الأصل: ${slots.Source.name} ${slots.Source.width}×${slots.Source.height} — النتيجة: ${slots.Result.name} ${slots.Result.width}×${slots.Result.height}\n${lines.join('\n')}${get('nqrNotes').value.trim()?'\nملاحظات: '+get('nqrNotes').value.trim():''}`;
  await window.NITAQ_SEND_TO_QC({sourceModule:'مقارنة النتيجة',promptTitle:get('nqrTask').value.trim()||'مراجعة بصرية',medium:'image',engine:'',outcome:o==='Accept'?'pass':o==='Reject'?'fail':'conditional',scores,failures,notes});
  modal.close();
};
/* ---------- استعادة تقرير سابق ---------- */
get('nqrRestore').onchange=async()=>{
  const input=get('nqrRestore'),f=input.files[0];if(!f)return;
  try{
    const r=JSON.parse(await f.text());
    if(r.version!==1||r.reviewType!=='manual-visual-review'||!Array.isArray(r.checks)||r.checks.length!==names.length)throw Error('ملف تقرير غير صالح.');
    const same=k=>slots[k]&&r.images&&r.images[k]&&r.images[k].name===slots[k].name&&r.images[k].width===slots[k].width&&r.images[k].height===slots[k].height;
    if(!same('Source')||!same('Result'))throw Error('ارفع نفس صورتي التقرير أولًا (نفس الاسم والأبعاد)، ثم استعد التقرير.');
    get('nqrTask').value=typeof r.requestedEdit==='string'?r.requestedEdit:'';
    r.checks.forEach((c,i)=>{const s=get('nqrCheck'+i);if([...s.options].some(o=>o.value===c.status))s.value=c.status;syncSeg(i);});
    get('nqrNotes').value=typeof r.notes==='string'?r.notes:'';
    decision();get('nqrInfo').textContent='تمت استعادة التقرير على نفس الصورتين.';
  }catch(e){get('nqrInfo').textContent=e.message;}
  finally{input.value='';}
};
decision();
})();
