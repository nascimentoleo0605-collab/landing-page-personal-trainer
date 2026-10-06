const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const header = document.querySelector('.header');
const headerInner = document.querySelector('.header-inner');
const media = matchMedia('(min-width: 1280px)');
function closeMenu(restoreFocus = false) {
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Abrir menu');
  navigation.classList.remove('is-open');
  if (restoreFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open',open);
});
document.addEventListener('keydown',event=> { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click',event=> { if (!event.target.closest('.header')) closeMenu(); });
header.addEventListener('focusout',event=> { if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu(); });
navigation.addEventListener('click',event=> {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  if (link.hash) document.querySelector(link.hash)?.focus({preventScroll:true});
});
function fitNavigation() {
  header.classList.remove('is-compact');
  if (media.matches) {
    const required = headerInner.querySelector('.brand').getBoundingClientRect().width + navigation.scrollWidth + 30;
    header.classList.toggle('is-compact',required > headerInner.clientWidth);
  }
}
media.addEventListener('change',()=> { closeMenu(); fitNavigation(); });
if ('ResizeObserver' in window) {
  const headerObserver = new ResizeObserver(fitNavigation);
  headerObserver.observe(headerInner);
  headerObserver.observe(headerInner.querySelector('.brand'));
}
document.fonts.ready.then(fitNavigation);
fitNavigation();

document.querySelectorAll('section[id]').forEach(section=> section.setAttribute('tabindex','-1'));
const floatingContact = document.querySelector('.floating-whatsapp');
const hero = document.querySelector('.hero');
if (floatingContact && hero && 'IntersectionObserver' in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    floatingContact.hidden = entry.isIntersecting;
  }, { threshold: 0.1 });
  contactObserver.observe(hero);
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{opacity:.45,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});
      observer.unobserve(entry.target);
    });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
  reducedMotion.addEventListener('change',event=> { if(event.matches) {observer.disconnect(); document.getAnimations().forEach(animation=>animation.cancel());} });
}
