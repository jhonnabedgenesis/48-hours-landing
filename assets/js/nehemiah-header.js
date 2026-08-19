
  (function () {

    var section =
      document.getElementById(
        'nehemiah-header-sections--21367313334350__nehemiah_header_FWDbLd'
      );

    if (!section) {
      return;
    }


    /* ======================================================
       MOBILE MENU
       ====================================================== */

    var toggle =
      section.querySelector(
        '[data-mobile-toggle]'
      );

    var panel =
      section.querySelector(
        '[data-mobile-panel]'
      );

    var shell =
      section.querySelector(
        '[data-header-shell]'
      );


    function openMenu() {

      if (!toggle || !panel) {
        return;
      }

      toggle.setAttribute(
        'aria-expanded',
        'true'
      );

      panel.hidden = false;

      requestAnimationFrame(
        function () {

          panel.classList.add(
            'is-open'
          );

        }
      );

    }


    function closeMenu() {

      if (!toggle || !panel) {
        return;
      }

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      panel.classList.remove(
        'is-open'
      );

      panel.hidden = true;

    }


    function toggleMenu() {

      if (!toggle) {
        return;
      }

      var isOpen =
        toggle.getAttribute(
          'aria-expanded'
        ) === 'true';

      if (isOpen) {

        closeMenu();

      } else {

        openMenu();

      }

    }


    if (toggle && panel) {

      toggle.addEventListener(
        'click',
        toggleMenu
      );


      section
        .querySelectorAll(
          '[data-mobile-link]'
        )
        .forEach(
          function (link) {

            link.addEventListener(
              'click',
              closeMenu
            );

          }
        );


      document.addEventListener(
        'keydown',
        function (event) {

          if (
            event.key !== 'Escape'
          ) {
            return;
          }

          if (
            toggle.getAttribute(
              'aria-expanded'
            ) === 'true'
          ) {

            closeMenu();

            toggle.focus();

          }

        }
      );


      document.addEventListener(
        'click',
        function (event) {

          if (
            toggle.getAttribute(
              'aria-expanded'
            ) !== 'true'
          ) {
            return;
          }

          if (
            section.contains(
              event.target
            )
          ) {
            return;
          }

          closeMenu();

        }
      );


      window.addEventListener(
        'resize',
        function () {

          if (
            window.innerWidth > 989
          ) {

            closeMenu();

          }

        },
        {
          passive: true
        }
      );

    }


    /* ======================================================
       SCROLLED HEADER STATE
       ====================================================== */

    function updateHeaderScrollState() {

      if (!shell) {
        return;
      }

      if (
        window.scrollY > 10
      ) {

        shell.classList.add(
          'is-scrolled'
        );

      } else {

        shell.classList.remove(
          'is-scrolled'
        );

      }

    }


    updateHeaderScrollState();


    window.addEventListener(
      'scroll',
      updateHeaderScrollState,
      {
        passive: true
      }
    );

  })();
