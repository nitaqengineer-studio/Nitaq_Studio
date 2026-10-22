/* NITAQ UI — تحسين شكلي فقط: يعرض أزرار اختيار الملفات بالعربية مع اسم الملف المختار.
   لا يغيّر قيم الحقول ولا معالجتها. يعمل على أي <input type=file> داخل <label>، بما فيها ما يُضاف لاحقًا. */
(()=>{
  try{if(window.top!==window)document.documentElement.classList.add('nq-embedded');}catch{document.documentElement.classList.add('nq-embedded');}
  const TEXT={empty:'اختر ملفًا',json:'اختر ملف الجلسة'};
  function label(input){
    const f=input.files&&input.files[0];
    if(f)return f.name;
    return /json/.test(input.accept||'')?TEXT.json:TEXT.empty;
  }
  function sync(input){
    const s=input.nextElementSibling;
    if(!s||!s.classList.contains('nqPick'))return;
    const t=label(input);
    s.querySelector('.nqPickName').textContent=t;
    s.classList.toggle('has',!!(input.files&&input.files[0]));
  }
  function enhance(root){
    root.querySelectorAll('label input[type=file]:not([data-nq-pick])').forEach(input=>{
      if(input.closest('.nqDrop,.nqFileBtn'))return; // لها شكل خاص
      input.dataset.nqPick='1';
      input.classList.add('nqPickInput');
      const s=document.createElement('span');s.className='nqPick';s.setAttribute('aria-hidden','true');
      s.innerHTML='<span class="nqPickBtn">اختيار</span><span class="nqPickName"></span>';
      input.after(s);
      input.addEventListener('change',()=>sync(input));
      sync(input);
    });
  }
  const all=()=>document.querySelectorAll('input[data-nq-pick]').forEach(sync);
  enhance(document);
  new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)enhance(n);}).observe(document.body,{childList:true,subtree:true});
  // أزرار «إزالة» تفرغ الحقل برمجيًا بدون حدث change؛ نعيد المزامنة بعد أي نقرة.
  document.addEventListener('click',()=>setTimeout(all,0),true);
})();
