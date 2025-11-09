$(document).ready(function () {

  /* =========================================
     Helper: activate section/link by a hash
     ========================================= */
  function activateByHash(hash, doScroll) {
    if (!hash) return;

    const $target = $(hash);
    if (!$target.length) return;

    // All submenu links
    const $links = $('.rules-sub-menu .r-sub-titre');

    // Build a jQuery selector of all targetable sections from links' href="#id"
    const ids = $links
      .map(function () { return $(this).attr('href'); })
      .get()
      .filter(h => h && h.startsWith('#'));

    const $sections = ids.length ? $(ids.join(',')) : $();

    // 1) Link highlight
    $links.removeClass('r-select');
    $links.filter('[href="' + hash + '"]').addClass('r-select');

    // 2) Section highlight (as requested)
    $sections.removeClass('r-select');
    $target.addClass('r-select');

    if (doScroll) {
      $target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Submenu click scroll + URL hash update
  $('.rules-sub-menu').on('click', '.r-sub-titre', function (e) {
    e.preventDefault();

    const targetId = $(this).attr('href');

    // Switch highlight + scroll
    activateByHash(targetId, true);

    // Update URL hash without reloading / jumping
    if (history.replaceState) {
      history.replaceState(null, '', targetId);
    } else {
      // Fallback (older browsers)
      window.location.hash = targetId;
    }
  });

  // Dropdowns (unchanged)
  $('.listing-comptes').each(function () {
    const $compte = $(this);
    const $toggleBtn = $compte.find('.listing_t');
    const $list = $compte.find('.listing_l');

    $list.css({ display: 'none', overflow: 'hidden' });

    $toggleBtn.on('click', function (e) {
      e.stopPropagation();
      $('.listing_l').not($list).each(function () {
        $(this).stop(true, true).animate({ height: 0, opacity: 0 }, 150, function () {
          $(this).hide();
        });
      });

      $('.listing-comptes').not($compte).removeClass('squirk');

      if ($list.is(':visible')) {
        $list.stop(true, true).animate({ height: 0, opacity: 0 }, 150, function () {
          $list.hide();
          $compte.removeClass('squirk');
        });
      } else {
        $list
          .css({ display: 'flex', height: 0, opacity: 0 })
          .stop(true, true)
          .animate({ height: $list[0].scrollHeight, opacity: 1 }, 250);
        $compte.addClass('squirk');
      }
    });

    $list.on('click', function (e) {
      e.stopPropagation();
    });
  });

  $(document).on('click', function () {
    $('.listing_l:visible').each(function () {
      $(this).stop(true, true).animate({ height: 0, opacity: 0 }, 150, function () {
        $(this).hide();
      });
    });
    $('.listing-comptes').removeClass('squirk');
  });

  $('.listing_l').each(function () {
    const $comptes = $(this).find('.s-compte');
    $comptes.removeClass('last');
    if ($comptes.length >= 1) {
      $comptes.last().addClass('last');
    }
  });

  /* ===============================
     On load, honor existing hash
  =============================== */
  if (window.location.hash) {
    activateByHash(window.location.hash, true);
  }

  /* ===============================
     Back/forward support
  =============================== */
  window.addEventListener('hashchange', function () {
    activateByHash(window.location.hash, true);
  });
});
