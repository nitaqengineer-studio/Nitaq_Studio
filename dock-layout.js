/* NITAQ · تخطيط الأدوات المضمّنة داخل الاستديو.
   على الشاشات الكبيرة (≥1000px): الإطار يملأ مساحة العمل، وداخله: الإعدادات عمود يتمرر وحده، ولوحة العرض ثابتة.
   على الشاشات الصغيرة: يتمدد الإطار بطول محتواه، فيبقى تمرير الصفحة الواحد فقط.
   لا يغيّر منطق الأدوات؛ يضيف تنسيقًا فقط. يعمل على الإطارات من نفس الأصل (srcdoc والملفات المجاورة). */
(()=>{
const mq=matchMedia('(min-width:1000px)');
const fontBase=new URL('assets/fonts/',location.href).href;
const FONT=`@font-face{font-family:'Cairo';font-weight:300;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-300-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Cairo';font-weight:300;font-display:swap;src:local('Lama Sans Light'),local('LamaSans-Light'),url(${fontBase}tajawal-latin-300-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'Cairo';font-weight:400;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-400-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Cairo';font-weight:400;font-display:swap;src:local('Lama Sans'),local('Lama Sans Regular'),local('LamaSans-Regular'),url(${fontBase}tajawal-latin-400-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'Cairo';font-weight:500 900;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-500-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Cairo';font-weight:500 900;font-display:swap;src:local('Lama Sans Medium'),local('LamaSans-Medium'),url(${fontBase}tajawal-latin-500-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ UI';font-weight:300;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-300-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ UI';font-weight:300;font-display:swap;src:local('Lama Sans Light'),local('LamaSans-Light'),url(${fontBase}tajawal-latin-300-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ UI';font-weight:400;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-400-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ UI';font-weight:400;font-display:swap;src:local('Lama Sans'),local('Lama Sans Regular'),local('LamaSans-Regular'),url(${fontBase}tajawal-latin-400-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ UI';font-weight:500 900;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-500-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ UI';font-weight:500 900;font-display:swap;src:local('Lama Sans Medium'),local('LamaSans-Medium'),url(${fontBase}tajawal-latin-500-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'Tajawal';font-weight:300;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-300-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Tajawal';font-weight:300;font-display:swap;src:local('Lama Sans Light'),local('LamaSans-Light'),url(${fontBase}tajawal-latin-300-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'Tajawal';font-weight:400;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-400-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Tajawal';font-weight:400;font-display:swap;src:local('Lama Sans'),local('Lama Sans Regular'),local('LamaSans-Regular'),url(${fontBase}tajawal-latin-400-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'Tajawal';font-weight:500 900;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-500-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'Tajawal';font-weight:500 900;font-display:swap;src:local('Lama Sans Medium'),local('LamaSans-Medium'),url(${fontBase}tajawal-latin-500-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ Brand';font-weight:300;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-300-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ Brand';font-weight:300;font-display:swap;src:local('Lama Sans Light'),local('LamaSans-Light'),url(${fontBase}tajawal-latin-300-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ Brand';font-weight:400;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-400-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ Brand';font-weight:400;font-display:swap;src:local('Lama Sans'),local('Lama Sans Regular'),local('LamaSans-Regular'),url(${fontBase}tajawal-latin-400-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'NITAQ Brand';font-weight:500 900;font-display:swap;size-adjust:106%;src:url(${fontBase}tajawal-arabic-500-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+0870-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:'NITAQ Brand';font-weight:500 900;font-display:swap;src:local('Lama Sans Medium'),local('LamaSans-Medium'),url(${fontBase}tajawal-latin-500-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:'DM Sans';font-weight:300;font-display:swap;src:local('Lama Sans Light'),local('LamaSans-Light'),url(${fontBase}tajawal-latin-300-normal.woff2) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:400;font-display:swap;src:local('Lama Sans'),local('Lama Sans Regular'),local('LamaSans-Regular'),url(${fontBase}tajawal-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:500 900;font-display:swap;src:local('Lama Sans Medium'),local('LamaSans-Medium'),url(${fontBase}tajawal-latin-500-normal.woff2) format('woff2')}
html{font-synthesis:none}
`;
const CSS={
/* مدار الكاميرا: الإعدادات يمين، المدار يسار ثابت، البرومبت أسفل المدار */
orbit:FONT+`
body{font-family:'NITAQ Brand',system-ui,Segoe UI,Arial;font-size:13px;line-height:1.7}
h2{font-size:16px!important;font-weight:500}
label{font-size:13px;font-weight:500!important}
input,select,textarea,button{font-size:13px}
input:not([type=range]):not([type=checkbox]):not([type=radio]),select{padding:8px 10px!important;min-height:0!important}
.seg button{font-size:14px;padding:8px 10px!important}
.presetGrid button{padding:11px 6px!important;font-size:13.5px}
.note,small,.help,.legend,.orbit-help{font-size:12.5px!important}
#stage text{font-family:'NITAQ Brand',system-ui}
main>section:nth-of-type(1){overflow-x:hidden}
html.nq-dock,html.nq-dock body{height:100%;overflow:hidden}
html.nq-dock main{height:100%;max-width:none;margin:0;padding:10px;box-sizing:border-box;gap:10px;grid-template-columns:330px minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto}
html.nq-dock main>section{min-height:0;box-sizing:border-box;padding:14px 16px;border-radius:12px}
html.nq-dock main>section:nth-of-type(1){grid-column:1;grid-row:1;overflow:auto}
html.nq-dock main>section:nth-of-type(2){grid-column:2;grid-row:1/3;overflow:auto}
html.nq-dock main>section:nth-of-type(2)>h2{margin:0 0 6px;font-size:16px}
html.nq-dock #stage{height:calc(100vh - 210px);min-height:260px;width:100%}
html.nq-dock main>section:nth-of-type(2) .note{margin:6px 0;padding:8px 10px;font-size:13px}
html.nq-dock main>section.wide{grid-column:1;grid-row:2;padding:10px 14px;max-height:45vh;overflow:auto;box-shadow:0 -6px 16px rgba(16,23,37,.06)}
html.nq-dock main>section.wide>*{margin:0 0 6px}
html.nq-dock main>section.wide>h2{font-size:13.5px;line-height:1.6}
html.nq-dock main>section.wide>.row{display:flex;flex-direction:column;align-items:stretch;gap:6px}
html.nq-dock main>section.wide #promptTitle{font-size:13.5px;line-height:1.6;margin:0}
html.nq-dock main>section.wide #copy{width:100%;padding:9px 14px;margin:0}
html.nq-dock main>section.wide summary{padding:6px 10px}
html.nq-dock main>section.wide #status:empty{display:none}
html.nq-dock main>section.wide p,html.nq-dock main>section.wide small{font-size:11px;line-height:1.6}
html.nq-dock #prompt{min-height:160px}
/* ---- تبسيط المدار ---- */
main>section{min-width:0;position:relative}
main>section:nth-of-type(1) input,main>section:nth-of-type(1) select{max-width:100%}
.nq-hide{display:none!important}
input#file.nq-file{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;border:0!important;opacity:0!important;overflow:hidden!important}
.nq-pick{display:flex!important;align-items:center;gap:10px;margin-top:6px!important;padding:6px;border:1px dashed #C9A25D;border-radius:10px;background:#FBF8F1;cursor:pointer;font-weight:400!important}
.nq-pick:hover{background:#F7F1E4}
.nq-pick-b{flex:none;background:#101725;color:#fff;border-radius:7px;padding:6px 14px;font-size:12.5px;font-weight:500}
.nq-pick-n{flex:1;min-width:0;color:#6E7787;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nq-pick.has{border-style:solid;border-color:#E4E1DA;background:#fff}
.nq-pick.has .nq-pick-n{color:#101725;direction:ltr;text-align:right}
.nq-more,.nq-help{margin-top:12px;border:1px solid #E4E1DA;border-radius:10px;background:#fff}
.nq-more>summary,.nq-help>summary{cursor:pointer;list-style:none;padding:8px 12px;font-size:12.5px;font-weight:500;color:#101725;display:flex;align-items:center;gap:8px}
.nq-more>summary::-webkit-details-marker,.nq-help>summary::-webkit-details-marker{display:none}
.nq-more>summary::after,.nq-help>summary::after{content:'▾';margin-inline-start:auto;color:#6E7787;transition:transform .15s}
.nq-more[open]>summary::after,.nq-help[open]>summary::after{transform:rotate(180deg)}
.nq-more>.nq-body,.nq-help>.nq-body{padding:0 12px 10px;border-top:1px solid #EEEDEA}
.nq-help>summary{color:#6E7787;font-weight:400}
.nq-help .legend{justify-content:flex-start;flex-wrap:wrap;gap:12px;margin:10px 0 4px}
.nq-help .help{margin:8px 0 0}
.nq-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch;margin-top:8px}
.nq-bar>.nq-yaw{flex:1 1 360px;display:flex;gap:4px;flex-wrap:nowrap;background:#F7F6F3;border-radius:10px;padding:3px}
.nq-bar>.nq-yaw>button{flex:1;padding:6px 4px!important;font-size:12.5px!important;border:0;background:transparent;border-radius:8px;white-space:nowrap}
.nq-bar>.nq-yaw>button:hover{background:#fff}
.nq-bar>#summary{flex:1 1 280px;margin:0!important;padding:6px 12px!important;font-size:12.5px!important;display:flex;align-items:center;border-radius:10px}
#riskBanner{margin:8px 0 0!important;padding:6px 12px!important;font-size:12.5px!important;line-height:1.7;position:relative}
#riskBanner .risk-title{display:inline;margin:0 0 0 6px}
#riskBanner:not([data-nq-open]){max-height:calc(1.7em + 12px);overflow:hidden;cursor:pointer;padding-inline-end:90px!important}
#riskBanner:not([data-nq-open]) br{display:none}
#riskBanner:not([data-nq-open])::after{content:'التفاصيل ▾';position:absolute;inset-inline-end:10px;top:6px;font-weight:500;background:inherit;padding-inline-start:8px}
#riskBanner[data-nq-open]{cursor:pointer}
.nq-actions{display:flex;gap:8px;margin-top:8px;align-items:center}
.nq-actions>button{flex:none;padding:7px 14px!important;font-size:13px!important}
.nq-actions>.nq-help{flex:1;margin:0;border:0;background:transparent}
.nq-actions>.nq-help>summary{justify-content:flex-end;padding:7px 4px}
.nq-actions>.nq-help[open]{position:relative}
.nq-actions>.nq-help>.nq-body{position:absolute;inset-inline-end:0;bottom:calc(100% + 6px);width:min(560px,80vw);max-height:50vh;overflow:auto;background:#fff;border:1px solid #E4E1DA;border-radius:12px;box-shadow:0 10px 30px rgba(16,23,37,.14);padding:10px 14px;z-index:5}
.nq-saved{margin-top:8px;border-top:1px solid #EEEDEA;padding-top:8px;display:flex;align-items:center;gap:10px}
.nq-saved:has(#saved:empty){display:none}
.nq-saved>h2{font-size:12.5px!important;margin:0!important;white-space:nowrap;flex:none}
.nq-saved #saved{margin:0;flex:1;min-width:0;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding-bottom:2px}
.nq-saved .shot{flex:none;display:flex;align-items:center;gap:4px;padding:3px 4px 3px 8px;font-size:12px;white-space:nowrap}
.nq-saved .shot button{padding:2px 8px;margin:0;font-size:11.5px}
.nq-saved .shot .badge{margin:0 2px}
.nq-saved .nq-row{display:flex;gap:6px;flex:none}
.nq-saved .nq-row>button{flex:none;padding:6px 12px;font-size:12.5px}
html.nq-dock main>section:nth-of-type(2){display:flex;flex-direction:column}
html.nq-dock main>section:nth-of-type(2)>h2{display:none}
html.nq-dock #stage{flex:1 1 0;height:0!important;min-height:240px}
html.nq-dock main>section:nth-of-type(1)>h2{font-size:14px!important;margin:0 0 4px}
html.nq-dock main>section.wide>.help{display:none}
`
};
/* المخططات والمكتب الفني صفحات مستقلة تنسّق نفسها (assets/nitaq-embed.*)، لأن الاستديو حين يُفتح من المجلد (file://)
   لا يستطيع الوصول لمحتواها. نتواصل معها بالرسائل فقط. مدار الكاميرا (srcdoc) من نفس الأصل فننسّقه مباشرة. */
function kind(f){const t=f.getAttribute('title')||'';if(t.includes('مدار الكاميرا'))return'orbit';if(t.includes('المخططات'))return'plan';if(t.includes('مساعد المكتب'))return'desk';return null;}
function docOf(f){try{return f.contentDocument;}catch{return null;}}
function fitOrbit(f){
  const doc=docOf(f);if(!doc||!doc.body)return;
  if(mq.matches){f.style.removeProperty('height');return;}
  const h=Math.ceil(Math.max(doc.body.scrollHeight,doc.body.getBoundingClientRect().height))+4;
  if(h>100)f.style.setProperty('height',h+'px','important');
}
function applyOrbit(f){
  const doc=docOf(f);if(!doc||!doc.documentElement||!doc.body)return;
  let st=doc.getElementById('nq-dock-style');
  if(!st){st=doc.createElement('style');st.id='nq-dock-style';(doc.head||doc.documentElement).append(st);}
  if(st.textContent!==CSS.orbit)st.textContent=CSS.orbit;
  doc.documentElement.classList.toggle('nq-dock',mq.matches);
  if(!f._nqRO&&window.ResizeObserver){f._nqRO=new ResizeObserver(()=>fitOrbit(f));f._nqRO.observe(doc.body);}
  fitOrbit(f);
}
function tellMode(f){try{f.contentWindow&&f.contentWindow.postMessage({nqEmbed:true,type:'mode',dock:mq.matches},'*');}catch{}if(mq.matches)f.style.removeProperty('height');}
window.addEventListener('message',e=>{
  const d=e.data;if(!d||d.nqEmbed!==true)return;
  const f=[...document.querySelectorAll('iframe.dock-frame')].find(x=>x.contentWindow===e.source);if(!f)return;
  if(d.type==='ready')tellMode(f);
  if(d.type==='height'&&!mq.matches&&d.h>100&&d.h<200000)f.style.setProperty('height',Math.ceil(d.h)+'px','important');
});
function forwardKeys(f){let doc;try{doc=f.contentDocument;}catch{return;}if(!doc||doc._nqKeys)return;doc._nqKeys=true;doc.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&(e.key==='k'||e.key==='K'||e.code==='KeyK')){e.preventDefault();window.dispatchEvent(new Event('nitaq-palette'));}});}
/* تبسيط واجهة المدار: نفس العناصر والمعرّفات ونفس المنطق؛ نعيد ترتيبها فقط.
   الشروح الطويلة تُجمع في «طريقة الاستخدام وحدود الأداة» (مطوية)، والخيارات الأقل استخدامًا في «خيارات إضافية». */
function simplifyOrbit(f){
  const doc=docOf(f);if(!doc||!doc.body||doc.body.dataset.nqSimple)return;
  const $=id=>doc.getElementById(id);
  const secs=doc.querySelectorAll('main>section');const s1=secs[0],s2=secs[1],s3=doc.querySelector('main>section.wide');
  if(!s1||!s2||!$('stage')||!$('summary'))return;
  doc.body.dataset.nqSimple='1';
  const lab=id=>doc.querySelector(`label[for="${id}"]`);
  const el=(tag,cls,html)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e;};
  const drawer=(cls,title)=>{const d=el('details',cls);d.append(el('summary','',title));const b=el('div','nq-body');d.append(b);return [d,b];};
  /* زر اختيار الصورة بالعربية (نفس الحقل، مخفي بصريًا) */
  const fi=$('file');
  if(fi){const pk=el('label','nq-pick');pk.htmlFor='file';const bt=el('span','nq-pick-b','اختيار صورة');const nm=el('span','nq-pick-n','لم تُختر صورة');pk.append(bt,nm);
    fi.classList.add('nq-file');fi.after(pk);
    const sync=()=>{nm.textContent=fi.files&&fi.files[0]?fi.files[0].name:'لم تُختر صورة';pk.classList.toggle('has',!!(fi.files&&fi.files[0]));};
    fi.addEventListener('change',sync);sync();
    const lb=lab('file');if(lb)lb.removeAttribute('for');}
  /* شروح */
  const [help,hb]=drawer('nq-help','ⓘ طريقة الاستخدام · المدار تخطيطي وليس قياسًا هندسيًا');
  const leg=s2.querySelector('.legend');if(leg)hb.append(leg);
  [...s1.querySelectorAll('.help'),...s2.querySelectorAll(':scope>.help'),...(s3?s3.querySelectorAll(':scope>.help'):[])].forEach(p=>{p.removeAttribute('style');hb.append(p);});
  /* شريط الزوايا السريعة + الملخص */
  const yawRow=s2.querySelector('[data-yaw]')?.parentElement;
  const bar=el('div','nq-bar');
  if(yawRow){yawRow.classList.add('nq-yaw');bar.append(yawRow);}
  bar.append($('summary'));
  $('stage').after(bar);bar.after($('riskBanner'));
  /* حفظ / إعادة ضبط + الشروح */
  const save=$('save'),reset=$('reset');const actRow=save&&save.parentElement;
  const acts=el('div','nq-actions');if(save)acts.append(save);if(reset)acts.append(reset);acts.append(help);
  $('riskBanner').after(acts);if(actRow&&actRow!==acts&&!actRow.children.length)actRow.remove();
  /* اللقطات المحفوظة: تظهر فقط حين توجد لقطات */
  const box=el('div','nq-saved');const h=[...s2.querySelectorAll(':scope>h2')].find(x=>x.textContent.includes('اللقطات المحفوظة'));
  if(h){h.removeAttribute('style');box.append(h);}
  box.append($('saved'));const r=el('div','nq-row');['batch','current'].forEach(id=>$(id)&&r.append($(id)));box.append(r);
  acts.after(box);
  const rb=$('riskBanner');rb.title='اضغط لعرض التفاصيل أو إخفائها';
  rb.addEventListener('click',()=>{if(rb.dataset.nqOpen!==undefined)delete rb.dataset.nqOpen;else rb.dataset.nqOpen='';});
  /* خيارات إضافية في عمود الإعدادات */
  const [more,mb]=drawer('nq-more','خيارات إضافية');
  [lab('frontRef'),$('frontRef'),lab('lens'),$('lens'),$('interior')?.closest('label'),$('support')?.closest('label')].forEach(x=>x&&mb.append(x));
  s1.append(more);
  /* افتح «خيارات إضافية» تلقائيًا إن كان فيها اختيار مفعّل حتى لا يُنسى */
  const open=()=>{if(($('frontRef')?.value||'').trim()||($('lens')&&$('lens').value!=='source')||$('interior')?.checked||$('support')?.checked)more.open=true;};
  open();
}
function apply(f){if(kind(f)==='orbit'){simplifyOrbit(f);applyOrbit(f);forwardKeys(f);}else tellMode(f);}
function setup(f){
  if(f.dataset.nqDock||!kind(f))return;f.dataset.nqDock='1';f.classList.add('dock-frame');
  f.addEventListener('load',()=>{f._nqRO&&f._nqRO.disconnect();f._nqRO=null;apply(f);});apply(f);
}
const scan=()=>document.querySelectorAll('iframe').forEach(setup);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
mq.addEventListener('change',()=>document.querySelectorAll('iframe.dock-frame').forEach(apply));
})();
