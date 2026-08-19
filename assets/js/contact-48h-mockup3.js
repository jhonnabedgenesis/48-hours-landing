(() => {
  const form=document.querySelector('.project-inquiry__form');
  form?.addEventListener('submit',event=>{event.preventDefault();const status=document.querySelector('.project-inquiry__status--success');if(status){status.hidden=false;status.scrollIntoView({behavior:'smooth',block:'center'});}});
  const reveal=[...document.querySelectorAll('.project-inquiry__form-card,.project-inquiry__side-card,.why-talk-first__card,.talk-first-cta__panel')];
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});reveal.forEach(el=>observer.observe(el));}else reveal.forEach(el=>el.classList.add('is-visible'));
  const top=document.querySelector('.mockup-back-to-top');if(top){const update=()=>top.classList.toggle('is-visible',scrollY>650);addEventListener('scroll',update,{passive:true});top.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));update();}
})();
