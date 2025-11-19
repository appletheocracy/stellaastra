$(function () {

  $('.r-titre').each(function () {
    const $t = $(this);

    // Wrap CONTENT in a <span>
    // Only if not already wrapped (prevents double-wrapping)
    if (!$t.children('span').length) {
      $t.wrapInner('<span></span>');
    }

    // Append the chevrons (only if not already added)
    if (!$t.find('.chevron-open').length) {
      $t.append('<ion-icon class="chevron-open" name="chevron-down-outline"></ion-icon>');
    }
    if (!$t.find('.chevron-close').length) {
      $t.append('<ion-icon class="chevron-close" name="chevron-up-outline"></ion-icon>');
    }
  });

  /* ==========================================
     1) Wrap contents for smooth height toggle
     ========================================== */
  $('.menu-droite-pliable').each(function () {
    const $menu  = $(this);
    const $title = $menu.children('.r-titre');
    const $rest  = $menu.children().not($title);

    // Wrap all content except the title ONCE
    if (!$menu.children('.r-menu-body').length && $rest.length) {
      $rest.wrapAll('<div class="r-menu-body"></div>');
    }
  });

  /* ==========================================
     2) Function to update .has-select + .deplie
     ========================================== */
  function updateHasSelect() {
    // Remove marker from all menus
    $('.menu-droite-pliable').removeClass('has-select');

    // Take the first .r-select (there should be only one)
    const $select = $('.r-sub-titre.r-select').first();

    if ($select.length) {
      const $parent = $select.closest('.menu-droite-pliable');
      // This menu is "pinned" open
      $parent.addClass('has-select deplie');
    }
  }

  /* ====================================================
     3) On load: if no .r-select, auto-select the first
     ==================================================== */
  if (!$('.r-sub-titre.r-select').length) {
    $('.menu-droite-pliable').each(function () {
      const $first = $(this).find('.r-sub-titre').first();
      if ($first.length) {
        $first.addClass('r-select');
        return false; // stop after the first found on the page
      }
    });
  }

  // Now sync .has-select / .deplie with the current .r-select
  updateHasSelect();

  /* ==========================================
     4) Click on .r-titre (accordion behavior)
     ========================================== */
  $(document).on('click', '.r-titre', function (e) {
    e.preventDefault();

    const $menu     = $(this).closest('.menu-droite-pliable');
    const hasSelect = $menu.hasClass('has-select');

    // Close other open menus that are not pinned
    $('.menu-droite-pliable.deplie').not($menu).each(function () {
      const $other = $(this);
      if (!$other.hasClass('has-select')) {
        $other.removeClass('deplie');
      }
    });

    // Toggle current menu
    if ($menu.hasClass('deplie')) {
      // If it has .has-select (i.e. contains .r-select), it cannot be closed
      if (!hasSelect) {
        $menu.removeClass('deplie');
      }
    } else {
      $menu.addClass('deplie');
    }
  });

  /* ==================================================
     5) Click on .r-sub-titre (move .r-select + pin)
     ================================================== */
  $(document).on('click', '.r-sub-titre', function () {
    // Let the anchor do its normal behavior (scroll), so no preventDefault

    // Move .r-select to the clicked link
    $('.r-sub-titre').removeClass('r-select');
    $(this).addClass('r-select');

    // Recompute which menu is pinned
    updateHasSelect();
  });

});
