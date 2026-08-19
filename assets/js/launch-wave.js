
    document.addEventListener('DOMContentLoaded', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mainContent = document.querySelector('#MainContent');
      if (!mainContent) return;

      const processSurface = mainContent.querySelector('[data-process-section]');
      const launchSurface = mainContent.querySelector('.launch48');
      const firstSectionSurface =
        mainContent.querySelector(':scope > .shopify-section:first-child > section') ||
        mainContent.querySelector(':scope > .shopify-section:first-child');

      /* Preserve the original launch48 behavior when that section exists.
         For mockup-3 pages without launch48/process-scroll, fall back to the
         first page section so the same moving field still renders. */
      const motionSurface = launchSurface || processSurface || firstSectionSurface;
      if (!motionSurface) return;

      motionSurface.classList.add('mockup-motion-surface');
      const launchWrapper = motionSurface.closest('.shopify-section');

      const canvas = document.createElement('canvas');
      canvas.className = 'mockup-flow-field';
      canvas.setAttribute('aria-hidden', 'true');
      motionSurface.prepend(canvas);

      const staticBackground = document.createElement('div');
      staticBackground.className = 'mockup-static-wave-background';
      staticBackground.setAttribute('aria-hidden', 'true');
      document.body.prepend(staticBackground);

      const remainingBackgroundColor = processSurface?.dataset.sharedBackgroundColor || '#061318';
      staticBackground.style.setProperty('background-color', remainingBackgroundColor, 'important');

      /* Read the Liquid-selected palette from CSS so the drawing engine can
         use green on the existing mockup templates and blue on mockup-3. */
      const motionStyles = getComputedStyle(document.documentElement);
      const lineStartRgb = motionStyles.getPropertyValue('--mockup-motion-line-start-rgb').trim();
      const lineMidRgb = motionStyles.getPropertyValue('--mockup-motion-line-mid-rgb').trim();
      const lineBrightRgb = motionStyles.getPropertyValue('--mockup-motion-line-bright-rgb').trim();
      const lineEndRgb = motionStyles.getPropertyValue('--mockup-motion-line-end-rgb').trim();
      const particleRgb = motionStyles.getPropertyValue('--mockup-motion-primary-rgb').trim();

      const context = canvas.getContext('2d', { alpha: true });
      if (!context) return;

      const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      const bands = [
        { y: 0.16, amplitude: 58, speed: 0.12, phase: 0.2 },
        { y: 0.51, amplitude: 82, speed: -0.085, phase: 2.4 },
        { y: 0.84, amplitude: 68, speed: 0.1, phase: 4.8 }
      ];
      const particles = Array.from({ length: 36 }, (_, index) => ({
        x: ((index * 47) % 101) / 100,
        y: ((index * 71) % 97) / 96,
        size: 0.45 + (index % 4) * 0.32,
        phase: index * 0.73
      }));

      let width = 0;
      let height = 0;
      let frame = 0;
      let gradient = null;
      let lastDraw = -34;
      let scrolling = false;
      let scrollTimer = 0;

      const resize = () => {
        width = motionSurface.clientWidth;
        const launchBottom = Math.ceil(motionSurface.getBoundingClientRect().bottom + window.scrollY);
        height = motionSurface.offsetHeight;
        /* Render above CSS resolution so the fine gradient lines stay crisp on
           Retina/mobile displays, while capping the scale for smooth animation. */
        const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 750 ? 1.5 : 2);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const processSection = processSurface ? processSurface.closest('.shopify-section') : null;
        const footerGroup = document.querySelector('.shopify-section-group-footer-group');
        const customFooter = Array.from(document.querySelectorAll('#MainContent .custom-footer-menus')).pop();
        const backgroundTop = processSection
          ? processSection.getBoundingClientRect().top + window.scrollY
          : launchBottom;
        const footerBottom = footerGroup
          ? footerGroup.getBoundingClientRect().bottom + window.scrollY
          : 0;
        const customFooterBottom = customFooter
          ? customFooter.getBoundingClientRect().bottom + window.scrollY
          : 0;
        const backgroundBottom = footerBottom || customFooterBottom
          ? Math.max(footerBottom, customFooterBottom)
          : document.documentElement.scrollHeight;
        staticBackground.style.top = `${backgroundTop}px`;
        staticBackground.style.height = `${Math.max(0, backgroundBottom - backgroundTop)}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${lineStartRgb}, 0.42)`);
        gradient.addColorStop(0.38, `rgba(${lineMidRgb}, 0.68)`);
        gradient.addColorStop(0.72, `rgba(${lineBrightRgb}, 0.82)`);
        gradient.addColorStop(1, `rgba(${lineEndRgb}, 0.34)`);
      };

      const draw = (time = 0) => {
        if (scrolling || (!reducedMotion && time - lastDraw < 16.67)) {
          frame = requestAnimationFrame(draw);
          return;
        }
        lastDraw = time;
        const seconds = time * 0.001;
        const mobile = width < 750;
        const heightScale = mobile ? 0.68 : 1;
        const spacing = mobile ? 4.2 : 6.4;
        const pointerStrength = mobile ? -44 : -78;

        pointer.x += (pointer.targetX - pointer.x) * 0.035;
        pointer.y += (pointer.targetY - pointer.y) * 0.035;
        context.clearRect(0, 0, width, height);

        bands.forEach((band, bandIndex) => {
          const centerY = height * band.y;
          const phase = band.phase + seconds * band.speed;
          for (let filament = 0; filament < 11; filament += 1) {
            const spread = (filament - 5) * spacing;
            const alpha = 0.045 + (1 - Math.abs(spread) / 70) * 0.08;
            const points = [];

            for (let x = -22; x <= width + 22; x += 22) {
              const nx = x / Math.max(width, 1);
              const primary = Math.sin(nx * 9.2 + phase + filament * 0.035) * band.amplitude * heightScale;
              const detail = Math.sin(nx * 22 - phase * 1.7 + bandIndex) * band.amplitude * 0.17 * heightScale;
              const distance = nx - pointer.x;
              const lift = Math.exp(-(distance * distance) / 0.025) * (pointer.y - band.y) * pointerStrength;
              points.push({ x, y: centerY + primary + detail + spread + lift });
            }

            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (let index = 1; index < points.length - 1; index += 1) {
              const point = points[index];
              const next = points[index + 1];
              context.quadraticCurveTo(point.x, point.y, (point.x + next.x) * 0.5, (point.y + next.y) * 0.5);
            }
            const last = points[points.length - 1];
            context.lineTo(last.x, last.y);
            context.globalAlpha = Math.min(0.85, alpha * 5.6);
            context.strokeStyle = gradient;
            context.lineWidth = filament % 6 === 0 ? 1.05 : 0.55;
            context.stroke();
          }
        });

        context.globalAlpha = 1;
        particles.forEach((particle) => {
          const pulse = 0.38 + Math.sin(seconds * 0.8 + particle.phase) * 0.24;
          context.beginPath();
          context.arc(particle.x * width, particle.y * height, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(${particleRgb}, ${Math.max(0.08, pulse)})`;
          context.fill();
        });

        if (!reducedMotion) frame = requestAnimationFrame(draw);
      };

      const updatePointer = (x, y) => {
        const launchRect = motionSurface.getBoundingClientRect();
        pointer.targetX = (x - launchRect.left) / Math.max(launchRect.width, 1);
        pointer.targetY = (y - launchRect.top) / Math.max(launchRect.height, 1);
      };

      resize();
      draw();
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('load', resize, { once: true });
      if ('ResizeObserver' in window) {
        let resizeFrame = 0;
        const layoutObserver = new ResizeObserver(() => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(resize);
        });
        layoutObserver.observe(motionSurface);
        layoutObserver.observe(document.querySelector('#MainContent'));
      }
      window.addEventListener('scroll', () => {
        scrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => { scrolling = false; }, 90);
      }, { passive: true });
      window.addEventListener('pointermove', event => updatePointer(event.clientX, event.clientY), { passive: true });
      window.addEventListener('touchmove', event => {
        const touch = event.touches && event.touches[0];
        if (touch) updatePointer(touch.clientX, touch.clientY);
      }, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (reducedMotion) return;
        if (document.hidden && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else if (!document.hidden && !frame) {
          frame = requestAnimationFrame(draw);
        }
      });

      const revealSections = Array.from(
        document.querySelectorAll('#MainContent > .shopify-section')
      );

      let afterLaunch = false;
      revealSections.forEach(section => {
        if (section === launchWrapper) {
          afterLaunch = true;
          return;
        }
        if (!afterLaunch) return;

        /* Keep one shared page gradient. Per-section fixed gradients restart
           at every mobile boundary and create visible horizontal bands. */
        section.style.setProperty('background', 'transparent', 'important');
        section.style.setProperty('background-color', 'transparent', 'important');
        section.style.setProperty('background-image', 'none', 'important');
        section.style.removeProperty('background-size');
        section.style.removeProperty('background-position');
        section.style.removeProperty('background-repeat');
        section.style.removeProperty('background-attachment');

        Array.from(section.children).forEach(child => {
          if (!child.matches('section, [id], .gradient, [class*="color-"]')) return;
          child.style.setProperty('background', 'transparent', 'important');
          child.style.setProperty('background-color', 'transparent', 'important');
          child.style.setProperty('background-image', 'none', 'important');
        });
      });

      revealSections.forEach((section, index) => {
        section.dataset.mockupReveal = index === 0 ? 'up' : (index % 2 ? 'left' : 'right');
        section.style.setProperty('--mockup-reveal-delay', `${Math.min(index, 3) * 45}ms`);
      });

      document.documentElement.classList.add('mockup-motion-ready');

      if (reducedMotion || !('IntersectionObserver' in window)) {
        revealSections.forEach(section => section.classList.add('is-mockup-visible'));
      } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-mockup-visible');
            observer.unobserve(entry.target);
          });
        }, {
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px'
        });

        revealSections.forEach(section => revealObserver.observe(section));
      }
    }, { once: true });
  