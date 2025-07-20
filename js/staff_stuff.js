$(document).ready(function () {
  $('.listing-comptes').each(function () {
    const $compte = $(this);
    const $toggleBtn = $compte.find('.listing_t');
    const $list = $compte.find('.listing_l');

    // Start hidden
    $list.css({ display: 'none', overflow: 'hidden' });

    // Toggle logic
    $toggleBtn.on('click', function (e) {
      e.stopPropagation();

      // Close all others
      $('.listing_l').not($list).each(function () {
        $(this)
          .stop(true, true)
          .animate({ height: 0, opacity: 0 }, 150, function () {
            $(this).hide();
          });
      });
      $('.listing-comptes').not($compte).removeClass('squirk');

      // Toggle this one
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

    // Prevent closing when clicking inside listing_l
    $list.on('click', function (e) {
      e.stopPropagation();
    });
  });

  // Close all when clicking outside
  $(document).on('click', function () {
    $('.listing_l:visible').each(function () {
      $(this)
        .stop(true, true)
        .animate({ height: 0, opacity: 0 }, 150, function () {
          $(this).hide();
        });
    });
    $('.listing-comptes').removeClass('squirk');
  });

  // Assign only .last class
  $('.listing_l').each(function () {
    const $comptes = $(this).find('.s-compte');
    $comptes.removeClass('last');

    if ($comptes.length >= 1) {
      $comptes.last().addClass('last');
    }
  });
});