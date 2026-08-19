(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 12), { passive: true });
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('visible'));
  else {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .12 });
    reveals.forEach(el => revealObserver.observe(el));
  }

  const steps = [...document.querySelectorAll('.process-steps li')];
  const images = [...document.querySelectorAll('.process-images img')];
  const progress = document.querySelector('.progress-track span');
  const activateStep = index => {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    images.forEach((image, i) => image.classList.toggle('active', i === index));
    if (progress) progress.style.width = `${((index + 1) / steps.length) * 100}%`;
  };
  if ('IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateStep(Number(visible.target.dataset.step));
    }, { rootMargin: '-30% 0px -35%', threshold: [0, .3, .6] });
    steps.forEach(step => stepObserver.observe(step));
  }

  document.querySelectorAll('.accordion details').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach(other => { if (other !== item) other.open = false; });
  }));

  document.querySelector('[data-contact-form], [data-static-contact-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    let message = event.currentTarget.querySelector('.form-message');
    if (!message) {
      message = document.createElement('p');
      message.className = 'form-message';
      message.setAttribute('role', 'status');
      event.currentTarget.append(message);
    }
    message.textContent = 'Form endpoint not configured yet. Your details have not been sent.';
  });
})();
