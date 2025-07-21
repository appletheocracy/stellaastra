$(document).ready(function () {
  const $menu = $('.mainmenu_lorebook .mainmenu');

  $menu.each(function () {
    const id = $(this).attr('href');
    if (id && id.startsWith('#') && $(id).length) {
      $(id).hide();
    }
  });

  function showTargetFrom($link, skipScroll = false) {
    const targetId = $link.attr('href');
    const $target = $(targetId);

    $menu.removeClass('select');
    $link.addClass('select');

    $menu.each(function () {
      const id = $(this).attr('href');
      if (id && id.startsWith('#') && $(id).length) {
        $(id).hide();
      }
    });

    if (targetId === '#intro' || !$target.length) {
      $('.content_menu').addClass('landing-mode');
    } else {
      $('.content_menu').removeClass('landing-mode');
    }

    if ($target.length) {
      $target.show();

      if (!skipScroll) {
        // Scroll inside the correct container if it's scrollable
        const $container = $('.rules-ctn'); // or .content_menu if it's scrollable
        if ($container.length && $container[0].scrollHeight > $container[0].clientHeight) {
          $container.animate({
            scrollTop: $container.scrollTop() + $target.position().top - 30
          }, 150);
        } else {
          // fallback to full page scroll
          $('html, body').animate({
            scrollTop: $target.offset().top - 30
          }, 150);
        }
      }
    } else {
      console.warn('Target not found:', targetId);
    }
  }

  const hash = window.location.hash;
  const $targetLink = hash
    ? $menu.filter(`[href="${hash}"]`)
    : $menu.filter('.select').first();

  if ($targetLink.length) {
    showTargetFrom($targetLink, true);
  }

  $('.mainmenu_lorebook').on('click', '.mainmenu', function (e) {
    e.preventDefault();
    const $this = $(this);
    const href = $this.attr('href');
    if ($this.hasClass('select')) return;
    history.replaceState(null, null, href);
    showTargetFrom($this);
  });

  // Submenu click scroll
$('.rules-sub-menu').on('click', '.r-sub-titre', function (e) {
  e.preventDefault();

  const $this = $(this);
  const targetId = $this.attr('href');
  const $target = $(targetId);

  $('.rules-sub-menu .r-sub-titre').removeClass('r-select');
  $this.addClass('r-select');

  if ($target.length) {
    $target[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});



  // Dropdowns
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
});
