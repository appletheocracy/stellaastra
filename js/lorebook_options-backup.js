$(document).ready(function () {

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
