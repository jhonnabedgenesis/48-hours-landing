
  (() => {
    const section = document.querySelector('.launch48--template--21371726692430__mockup_3_banner_YVfKyH');

    if (
      !section ||
      section.dataset.trustSliderReady === 'true'
    ) {
      return;
    }

    const slider =
      section.querySelector(
        '.launch48__trust-bar'
      );

    const slides =
      Array.from(
        section.querySelectorAll(
          '.launch48__trust-item'
        )
      );

    const dots =
      Array.from(
        section.querySelectorAll(
          '.launch48__trust-dot'
        )
      );

    if (
      !slider ||
      !slides.length ||
      !dots.length
    ) {
      return;
    }

    section.dataset.trustSliderReady = 'true';


    const setActiveDot = (index) => {

      dots.forEach(
        (dot, dotIndex) => {

          const active =
            dotIndex === index;

          dot.classList.toggle(
            'is-active',
            active
          );

          dot.setAttribute(
            'aria-current',
            active ? 'true' : 'false'
          );

        }
      );

    };


    const getActiveIndex = () => {

      if (!slider.clientWidth) {
        return 0;
      }

      return Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(
            slider.scrollLeft /
            slider.clientWidth
          )
        )
      );

    };


    let scrollFrame = null;


    slider.addEventListener(
      'scroll',
      () => {

        if (scrollFrame) {
          cancelAnimationFrame(
            scrollFrame
          );
        }

        scrollFrame =
          requestAnimationFrame(
            () => {

              setActiveDot(
                getActiveIndex()
              );

            }
          );

      },
      {
        passive: true
      }
    );


    dots.forEach(
      (dot) => {

        dot.addEventListener(
          'click',
          () => {

            const index =
              Number(
                dot.dataset.trustSlide
              );

            const slide =
              slides[index];

            if (!slide) {
              return;
            }

            slider.scrollTo({
              left: slide.offsetLeft,
              behavior: 'smooth'
            });

            setActiveDot(index);

          }
        );

      }
    );


    window.addEventListener(
      'resize',
      () => {

        if (
          window.matchMedia(
            '(max-width: 749px)'
          ).matches
        ) {

          const index =
            getActiveIndex();

          slider.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'auto'
          });

          setActiveDot(index);

        }

      }
    );


    setActiveDot(
      getActiveIndex()
    );

  })();


(function () {

  var sectionId = "template--21371726692430__process_scroll_MRgxzC";


  function initProcessSection() {

    var section = document.querySelector(
      '[data-process-section="' + sectionId + '"]'
    );


    if (!section) {
      return;
    }


    /*
     * Prevent duplicate initialization when Shopify
     * reloads the section in Theme Editor.
     */

    if (section.dataset.processInitialized === 'true') {
      return;
    }


    section.dataset.processInitialized = 'true';


    var list =
      section.querySelector(
        '[data-process-list]'
      );


    var timeline =
      section.querySelector(
        '[data-process-timeline]'
      );


    var progressLine =
      section.querySelector(
        '[data-process-progress]'
      );


    var steps =
      Array.prototype.slice.call(
        section.querySelectorAll(
          '[data-process-step]'
        )
      );


    var screens =
      Array.prototype.slice.call(
        section.querySelectorAll(
          '[data-process-screen]'
        )
      );


    if (
      !list ||
      !timeline ||
      !progressLine ||
      !steps.length
    ) {

      return;

    }


    var markerPositions = [];

    var railStart = 0;

    var railEnd = 1;

    var currentIndex = 0;

    var ticking = false;


    /*
     * ========================================================
     * CHANGE ACTIVE IMAGE
     * ========================================================
     */

    function setActiveScreen(index) {

      if (!screens.length) {
        return;
      }


      if (index < 0) {
        index = 0;
      }


      if (index > screens.length - 1) {

        index =
          screens.length - 1;

      }


      if (currentIndex === index) {
        return;
      }


      currentIndex = index;


      screens.forEach(
        function (screen, screenIndex) {

          screen.classList.toggle(
            'is-active',
            screenIndex === index
          );

        }
      );

    }


    /*
     * ========================================================
     * MEASURE TIMELINE
     * ========================================================
     */

    function measureTimeline() {

      var listRect =
        list.getBoundingClientRect();


      markerPositions =
        steps.map(
          function (step) {

            var marker =
              step.querySelector(
                '.step-num'
              );


            if (!marker) {
              return 0;
            }


            var markerRect =
              marker.getBoundingClientRect();


            return (
              markerRect.top -
              listRect.top +
              markerRect.height / 2
            );

          }
        );


      railStart =
        markerPositions[0] ||
        0;


      railEnd =
        markerPositions[
          markerPositions.length - 1
        ] ||
        Math.max(
          list.offsetHeight,
          1
        );


      var railHeight =
        Math.max(
          1,
          railEnd - railStart
        );


      timeline.style.top =
        railStart + 'px';


      timeline.style.height =
        railHeight + 'px';

    }


    /*
     * ========================================================
     * SCROLL UPDATE
     * ========================================================
     */

    function updateProcess() {

      ticking = false;


      if (!markerPositions.length) {

        measureTimeline();

      }


      var listRect =
        list.getBoundingClientRect();


      /*
       * Playhead sits around the middle
       * of the viewport.
       */

      var viewportAnchor =
        window.innerHeight * 0.52;


      var playhead =
        viewportAnchor -
        listRect.top;


      var railDistance =
        Math.max(
          1,
          railEnd - railStart
        );


      var progress =
        (
          playhead -
          railStart
        ) /
        railDistance;


      progress =
        Math.max(
          0,
          Math.min(
            1,
            progress
          )
        );


      progressLine.style.transform =
        'translateX(-50%) scaleY(' +
        progress +
        ')';


      /*
       * Find marker nearest
       * to the playhead.
       */

      var nearestIndex = 0;

      var nearestDistance =
        Infinity;


      markerPositions.forEach(
        function (
          markerPosition,
          index
        ) {

          var distance =
            Math.abs(
              playhead -
              markerPosition
            );


          if (
            distance <
            nearestDistance
          ) {

            nearestDistance =
              distance;

            nearestIndex =
              index;

          }

        }
      );


      /*
       * Before timeline begins,
       * keep step 1 active.
       */

      if (
        playhead <=
        railStart
      ) {

        nearestIndex = 0;

      }


      /*
       * After timeline finishes,
       * keep last step active.
       */

      if (
        playhead >=
        railEnd
      ) {

        nearestIndex =
          steps.length - 1;

      }


      /*
       * Update step states.
       */

      steps.forEach(
        function (
          step,
          index
        ) {

          step.classList.toggle(
            'is-active',
            index === nearestIndex
          );


          step.classList.toggle(
            'is-passed',
            index < nearestIndex
          );

        }
      );


      setActiveScreen(
        nearestIndex
      );

    }


    /*
     * ========================================================
     * REQUEST ANIMATION FRAME
     * ========================================================
     */

    function requestUpdate() {

      if (ticking) {
        return;
      }


      ticking = true;


      window.requestAnimationFrame(
        updateProcess
      );

    }


    /*
     * ========================================================
     * REFRESH
     * ========================================================
     */

    function refreshProcess() {

      markerPositions = [];


      measureTimeline();


      requestUpdate();

    }


    /*
     * ========================================================
     * EVENTS
     * ========================================================
     */

    window.addEventListener(
      'scroll',
      requestUpdate,
      {
        passive: true
      }
    );


    window.addEventListener(
      'resize',
      refreshProcess,
      {
        passive: true
      }
    );


    /*
     * Recalculate after images load.
     */

    section
      .querySelectorAll('img')
      .forEach(
        function (image) {

          if (!image.complete) {

            image.addEventListener(
              'load',
              refreshProcess,
              {
                once: true
              }
            );

          }

        }
      );


    /*
     * Initial state.
     */

    currentIndex = -1;


    measureTimeline();


    updateProcess();

  }


  /*
   * Standard storefront initialization.
   */

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initProcessSection,
      {
        once: true
      }
    );

  } else {

    initProcessSection();

  }


  /*
   * Shopify Theme Editor
   * section reload.
   */

  document.addEventListener(
    'shopify:section:load',
    function (event) {

      if (
        event.detail &&
        String(
          event.detail.sectionId
        ) ===
        String(sectionId)
      ) {

        initProcessSection();

      }

    }
  );

})();


(() => {

  const section =
    document.getElementById(
      "whatsincludedmockup3"
    );


  if (!section) return;


  /*
   * Prevent duplicate initialization
   * in Shopify Theme Editor.
   */
  if (
    section.dataset.includedInitialized ===
    'true'
  ) {
    return;
  }


  section.dataset.includedInitialized =
    'true';


  const animationEnabled =
    section.dataset.enableAnimation ===
    'true';


  const tiltEnabled =
    section.dataset.enableTilt ===
    'true';


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  const coarsePointer =
    window.matchMedia(
      '(pointer: coarse)'
    ).matches;


  const mobileQuery =
    window.matchMedia(
      '(max-width: 640px)'
    );


  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  if (
    animationEnabled &&
    !reducedMotion &&
    'IntersectionObserver' in window
  ) {

    section.classList.add(
      'included-features--animation-ready'
    );


    const heading =
      section.querySelector(
        '[data-included-reveal]'
      );


    const cards =
      Array.from(
        section.querySelectorAll(
          '[data-included-card]'
        )
      );


    const headingObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (!entry.isIntersecting) {
                return;
              }


              entry.target.classList.add(
                'is-visible'
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.15,

          rootMargin:
            '0px 0px -5% 0px'
        }
      );


    if (heading) {

      headingObserver.observe(
        heading
      );

    }


    const cardObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (!entry.isIntersecting) {
                return;
              }


              const card =
                entry.target;


              const index =
                cards.indexOf(card);


              window.setTimeout(
                () => {

                  card.classList.add(
                    'is-visible'
                  );

                },
                index * 60
              );


              observer.unobserve(
                card
              );

            }
          );

        },
        {
          threshold:
            0.08,

          rootMargin:
            '0px 0px -3% 0px'
        }
      );


    cards.forEach(
      (card) => {

        cardObserver.observe(
          card
        );

      }
    );

  } else {

    section
      .querySelectorAll(
        '[data-included-reveal], [data-included-card]'
      )
      .forEach(
        (element) => {

          element.classList.add(
            'is-visible'
          );

        }
      );

  }


  /* =====================================================
     DESKTOP TILT EFFECT
     ===================================================== */

  if (
    tiltEnabled &&
    !reducedMotion &&
    !coarsePointer
  ) {

    const cards =
      section.querySelectorAll(
        '[data-included-card]'
      );


    cards.forEach(
      (card) => {

        card.addEventListener(
          'mousemove',
          (event) => {

            /*
             * Never apply tilt while the mobile slider
             * breakpoint is active.
             */
            if (mobileQuery.matches) {
              return;
            }


            const rect =
              card.getBoundingClientRect();


            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width -
              0.5;


            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height -
              0.5;


            const rotateY =
              x * 5;


            const rotateX =
              y * -5;


            card.style.transform =
              `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
              `;

          }
        );


        card.addEventListener(
          'mouseleave',
          () => {

            if (mobileQuery.matches) {
              card.style.transform = '';
              return;
            }


            card.style.transform =
              `
                perspective(900px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
              `;

          }
        );

      }
    );

  }


  /* =====================================================
     MOBILE SLIDER
     ===================================================== */

  const slider =
    section.querySelector(
      '[data-included-slider]'
    );


  const slides =
    Array.from(
      section.querySelectorAll(
        '[data-included-slide]'
      )
    );


  const dots =
    Array.from(
      section.querySelectorAll(
        '[data-included-dot]'
      )
    );


  if (
    slider &&
    slides.length > 1
  ) {

    let scrollTimer = null;


    const updateDots =
      (activeIndex) => {

        dots.forEach(
          (dot, index) => {

            const active =
              index === activeIndex;


            dot.classList.toggle(
              'is-active',
              active
            );


            if (active) {

              dot.setAttribute(
                'aria-current',
                'true'
              );

            } else {

              dot.removeAttribute(
                'aria-current'
              );

            }

          }
        );

      };


    const getClosestSlideIndex =
      () => {

        const sliderRect =
          slider.getBoundingClientRect();


        let closestIndex =
          0;


        let closestDistance =
          Infinity;


        slides.forEach(
          (slide, index) => {

            const slideRect =
              slide.getBoundingClientRect();


            const distance =
              Math.abs(
                slideRect.left -
                sliderRect.left
              );


            if (
              distance <
              closestDistance
            ) {

              closestDistance =
                distance;


              closestIndex =
                index;

            }

          }
        );


        return closestIndex;

      };


    const updateActiveSlide =
      () => {

        if (!mobileQuery.matches) {
          return;
        }


        updateDots(
          getClosestSlideIndex()
        );

      };


    slider.addEventListener(
      'scroll',
      () => {

        if (!mobileQuery.matches) {
          return;
        }


        window.clearTimeout(
          scrollTimer
        );


        scrollTimer =
          window.setTimeout(
            updateActiveSlide,
            60
          );

      },
      {
        passive:
          true
      }
    );


    dots.forEach(
      (dot) => {

        dot.addEventListener(
          'click',
          () => {

            if (!mobileQuery.matches) {
              return;
            }


            const index =
              Number(
                dot.dataset.index
              );


            const slide =
              slides[index];


            if (!slide) {
              return;
            }


            slider.scrollTo({
              left:
                slide.offsetLeft -
                slider.offsetLeft,

              behavior:
                reducedMotion
                  ? 'auto'
                  : 'smooth'
            });


            updateDots(
              index
            );

          }
        );

      }
    );


    const handleBreakpointChange =
      () => {

        /*
         * Returning to desktop/tablet should restore
         * the original grid at its natural starting
         * position.
         */
        if (!mobileQuery.matches) {

          slider.scrollLeft =
            0;


          slides.forEach(
            (slide) => {

              slide.style.transform =
                '';

            }
          );


          updateDots(
            0
          );

          return;

        }


        updateActiveSlide();

      };


    if (
      typeof mobileQuery.addEventListener ===
      'function'
    ) {

      mobileQuery.addEventListener(
        'change',
        handleBreakpointChange
      );

    } else if (
      typeof mobileQuery.addListener ===
      'function'
    ) {

      mobileQuery.addListener(
        handleBreakpointChange
      );

    }


    updateDots(
      0
    );

  }

})();


(() => {

  const section =
    document.getElementById(
      "WhyGoCustom-template--21371726692430__why_go_custom_Q4YEcq"
    );

  if (!section) return;


  if (
    section.dataset.includedInitialized ===
    'true'
  ) {
    return;
  }


  section.dataset.includedInitialized =
    'true';


  const animationEnabled =
    section.dataset.enableAnimation ===
    'true';


  const tiltEnabled =
    section.dataset.enableTilt ===
    'true';


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  const coarsePointer =
    window.matchMedia(
      '(pointer: coarse)'
    ).matches;


  const mobileQuery =
    window.matchMedia(
      '(max-width: 640px)'
    );


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  if (
    animationEnabled &&
    !reducedMotion &&
    'IntersectionObserver' in window
  ) {

    section.classList.add(
      'included-features--animation-ready'
    );


    const heading =
      section.querySelector(
        '[data-included-reveal]'
      );


    const cards =
      Array.from(
        section.querySelectorAll(
          '[data-included-card]'
        )
      );


    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (!entry.isIntersecting) {
                return;
              }


              entry.target.classList.add(
                'is-visible'
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.1,

          rootMargin:
            '0px 0px -4% 0px'
        }
      );


    if (heading) {

      revealObserver.observe(
        heading
      );

    }


    cards.forEach(
      (card, index) => {

        const cardObserver =
          new IntersectionObserver(
            (entries, observer) => {

              entries.forEach(
                (entry) => {

                  if (!entry.isIntersecting) {
                    return;
                  }


                  window.setTimeout(
                    () => {

                      entry.target.classList.add(
                        'is-visible'
                      );

                    },
                    index * 55
                  );


                  observer.unobserve(
                    entry.target
                  );

                }
              );

            },
            {
              threshold:
                0.08,

              rootMargin:
                '0px 0px -3% 0px'
            }
          );


        cardObserver.observe(
          card
        );

      }
    );

  } else {

    section
      .querySelectorAll(
        '[data-included-reveal], [data-included-card]'
      )
      .forEach(
        (element) => {

          element.classList.add(
            'is-visible'
          );

        }
      );

  }


  /* =====================================================
     DESKTOP TILT
  ===================================================== */

  if (
    tiltEnabled &&
    !reducedMotion &&
    !coarsePointer
  ) {

    const cards =
      section.querySelectorAll(
        '[data-included-card]'
      );


    cards.forEach(
      (card) => {

        card.addEventListener(
          'mousemove',
          (event) => {

            if (mobileQuery.matches) {
              return;
            }


            const rect =
              card.getBoundingClientRect();


            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width -
              0.5;


            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height -
              0.5;


            const rotateY =
              x * 2.5;


            const rotateX =
              y * -2.5;


            card.style.transform =
              `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-2px)
              `;

          }
        );


        card.addEventListener(
          'mouseleave',
          () => {

            card.style.transform =
              '';

          }
        );

      }
    );

  }


  /* =====================================================
     MOBILE SLIDER
  ===================================================== */

  const slider =
    section.querySelector(
      '[data-included-slider]'
    );


  const slides =
    Array.from(
      section.querySelectorAll(
        '[data-included-slide]'
      )
    );


  const dots =
    Array.from(
      section.querySelectorAll(
        '[data-included-dot]'
      )
    );


  if (
    slider &&
    slides.length > 1
  ) {

    let scrollTimer =
      null;


    const updateDots =
      (activeIndex) => {

        dots.forEach(
          (dot, index) => {

            const active =
              index === activeIndex;


            dot.classList.toggle(
              'is-active',
              active
            );


            if (active) {

              dot.setAttribute(
                'aria-current',
                'true'
              );

            } else {

              dot.removeAttribute(
                'aria-current'
              );

            }

          }
        );

      };


    const getClosestSlideIndex =
      () => {

        const sliderRect =
          slider.getBoundingClientRect();


        let closestIndex =
          0;


        let closestDistance =
          Infinity;


        slides.forEach(
          (slide, index) => {

            const slideRect =
              slide.getBoundingClientRect();


            const distance =
              Math.abs(
                slideRect.left -
                sliderRect.left
              );


            if (
              distance <
              closestDistance
            ) {

              closestDistance =
                distance;


              closestIndex =
                index;

            }

          }
        );


        return closestIndex;

      };


    const updateActiveSlide =
      () => {

        if (!mobileQuery.matches) {
          return;
        }


        updateDots(
          getClosestSlideIndex()
        );

      };


    slider.addEventListener(
      'scroll',
      () => {

        if (!mobileQuery.matches) {
          return;
        }


        window.clearTimeout(
          scrollTimer
        );


        scrollTimer =
          window.setTimeout(
            updateActiveSlide,
            60
          );

      },
      {
        passive:
          true
      }
    );


    dots.forEach(
      (dot) => {

        dot.addEventListener(
          'click',
          () => {

            if (!mobileQuery.matches) {
              return;
            }


            const index =
              Number(
                dot.dataset.index
              );


            const slide =
              slides[index];


            if (!slide) {
              return;
            }


            slider.scrollTo({
              left:
                slide.offsetLeft -
                slider.offsetLeft,

              behavior:
                reducedMotion
                  ? 'auto'
                  : 'smooth'
            });


            updateDots(
              index
            );

          }
        );

      }
    );


    const handleBreakpointChange =
      () => {

        if (!mobileQuery.matches) {

          slider.scrollLeft =
            0;


          slides.forEach(
            (slide) => {

              slide.style.transform =
                '';

            }
          );


          updateDots(
            0
          );


          return;
        }


        updateActiveSlide();

      };


    if (
      typeof mobileQuery.addEventListener ===
      'function'
    ) {

      mobileQuery.addEventListener(
        'change',
        handleBreakpointChange
      );

    } else if (
      typeof mobileQuery.addListener ===
      'function'
    ) {

      mobileQuery.addListener(
        handleBreakpointChange
      );

    }


    updateDots(
      0
    );

  }

})();


  (() => {
    const section = document.getElementById('client-feedback-template--21371726692430__client_feedback_4VzBCG');

    if (!section) return;

    const slider = section.querySelector('[data-client-feedback-slider]');
    const slides = Array.from(
      section.querySelectorAll('[data-client-feedback-slide]')
    );
    const dots = Array.from(
      section.querySelectorAll('[data-client-feedback-dot]')
    );

    if (!slider || slides.length <= 1) return;

    const mobileQuery = window.matchMedia('(max-width: 749px)');

    let scrollTimer = null;

    const getClosestSlideIndex = () => {
      const sliderRect = slider.getBoundingClientRect();

      let closestIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideRect = slide.getBoundingClientRect();

        const distance = Math.abs(
          slideRect.left - sliderRect.left
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const updateDots = (activeIndex) => {
      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;

        dot.classList.toggle('is-active', isActive);

        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    };

    const handleScroll = () => {
      if (!mobileQuery.matches) return;

      window.clearTimeout(scrollTimer);

      scrollTimer = window.setTimeout(() => {
        const activeIndex = getClosestSlideIndex();
        updateDots(activeIndex);
      }, 60);
    };

    slider.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        if (!mobileQuery.matches) return;

        const index = Number(dot.dataset.index);
        const targetSlide = slides[index];

        if (!targetSlide) return;

        slider.scrollTo({
          left: targetSlide.offsetLeft - slider.offsetLeft,
          behavior: 'smooth'
        });

        updateDots(index);
      });
    });

    const resetDesktopSlider = () => {
      if (!mobileQuery.matches) {
        slider.scrollLeft = 0;
        updateDots(0);
      }
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener(
        'change',
        resetDesktopSlider
      );
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(
        resetDesktopSlider
      );
    }

    updateDots(0);
  })();


(function () {

  const section =
    document.getElementById(
      "faqmockup3"
    );


  if (!section) {
    return;
  }


  /*
   * Prevent duplicate initialization
   * when Shopify reloads the section
   * inside the Theme Editor.
   */
  if (
    section.dataset.faqInitialized ===
    'true'
  ) {
    return;
  }


  section.dataset.faqInitialized =
    'true';


  const items =
    section.querySelectorAll(
      '.launch-faq__item'
    );


  /* ======================================
     OPEN ITEM
     ====================================== */

  function openItem(item) {

    const button =
      item.querySelector(
        '[data-faq-button]'
      );


    const answer =
      item.querySelector(
        '[data-faq-answer]'
      );


    if (
      !button ||
      !answer
    ) {
      return;
    }


    item.classList.add(
      'is-open'
    );


    button.setAttribute(
      'aria-expanded',
      'true'
    );


    answer.style.maxHeight =
      answer.scrollHeight +
      'px';

  }


  /* ======================================
     CLOSE ITEM
     ====================================== */

  function closeItem(item) {

    const button =
      item.querySelector(
        '[data-faq-button]'
      );


    const answer =
      item.querySelector(
        '[data-faq-answer]'
      );


    if (
      !button ||
      !answer
    ) {
      return;
    }


    item.classList.remove(
      'is-open'
    );


    button.setAttribute(
      'aria-expanded',
      'false'
    );


    answer.style.maxHeight =
      '0px';

  }


  /* ======================================
     INITIALIZE ITEMS
     ====================================== */

  function initializeItems() {

    items.forEach(
      function (item) {

        if (
          item.classList.contains(
            'is-open'
          )
        ) {

          openItem(
            item
          );

        } else {

          closeItem(
            item
          );

        }

      }
    );

  }


  initializeItems();


  /* ======================================
     ACCORDION CLICK
     ====================================== */

  items.forEach(
    function (item) {

      const button =
        item.querySelector(
          '[data-faq-button]'
        );


      if (!button) {
        return;
      }


      button.addEventListener(
        'click',
        function () {

          const isOpen =
            item.classList.contains(
              'is-open'
            );


          

            items.forEach(
              function (otherItem) {

                if (
                  otherItem !==
                  item
                ) {

                  closeItem(
                    otherItem
                  );

                }

              }
            );

          


          if (isOpen) {

            closeItem(
              item
            );

          } else {

            openItem(
              item
            );

          }

        }
      );

    }
  );


  /* ======================================
     RECALCULATE OPEN ACCORDION HEIGHTS
     ====================================== */

  window.addEventListener(
    'resize',
    function () {

      items.forEach(
        function (item) {

          if (
            !item.classList.contains(
              'is-open'
            )
          ) {
            return;
          }


          const answer =
            item.querySelector(
              '[data-faq-answer]'
            );


          if (!answer) {
            return;
          }


          answer.style.maxHeight =
            answer.scrollHeight +
            'px';

        }
      );

    },
    {
      passive: true
    }
  );

})();
