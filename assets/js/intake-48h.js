(() => {
  const section = document.getElementById('CustomAppForm-intake');
  if (!section) return;
  const integrationSelect = section.querySelector('[data-caf-integration-select]');
  const integrationField = section.querySelector('[data-caf-integration-field]');
  const existingSelect = section.querySelector('[data-caf-existing-app-select]');
  const existingField = section.querySelector('[data-caf-existing-app-field]');
  const toggleIntegration = () => integrationField?.classList.toggle('is-visible', integrationSelect?.value === 'Yes' || integrationSelect?.value === 'Not sure');
  const toggleExisting = () => existingField?.classList.toggle('is-visible', existingSelect?.value === 'Yes');
  integrationSelect?.addEventListener('change', toggleIntegration);
  existingSelect?.addEventListener('change', toggleExisting);
  toggleIntegration(); toggleExisting();
  section.querySelector('form')?.addEventListener('submit', event => {
    event.preventDefault();
    const status = section.querySelector('.custom-app-form__status--success');
    if (status) { status.hidden = false; status.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  const backToTop = document.querySelector('.mockup-back-to-top');
  if (backToTop) {
    const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 650);
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    }));
    updateBackToTop();
  }
})();
