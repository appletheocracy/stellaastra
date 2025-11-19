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

    if (!$menu.children('.r-menu-body').length && $rest.length) {
      $rest.wrapAll('<div class="r-menu-body"></div>');
    }
  });

  /* ==========================================
     2) Function to manage .has-select and .deplie
     ========================================== */
  function updateHasSelect() {

    // Identify the NEW selected link
    const $select = $('.r-sub-titre.r-select').first();

    // Track which menu had .has-select BEFORE update
    const $oldPinned = $('.menu-droite-pliable.has-select');

    // Remove .has-select from all
    $('.menu-droite-pliable').removeClass('has-select');

    if ($select.length) {
      const $newPinned = $select.closest('.menu-droite-pliable');

      // Assign .has-select + ensure open
      $newPinned.addClass('has-select deplie');

      // Any OLD pinned menus that LOST the select must CLOSE
      $oldPinned.not($newPinned).each(function () {
        $(this).removeClass('deplie'); // auto-close since no longer pinned
      });
    }
  }

  /* ====================================================
     3) On load: Ensure one .r-select exists
     ==================================================== */
  if (!$('.r-sub-titre.r-select').length) {
    $('.menu-droite-pliable').each(function () {
      const $first = $(this).find('.r-sub-titre').first();
      if ($first.length) {
        $first.addClass('r-select');
        return false;
      }
    });
  }

  updateHasSelect();


  /* ==========================================
     4) Click on .r-titre (accordion behavior)
     ========================================== */
  $(document).on('click', '.r-titre', function (e) {
    e.preventDefault();

    const $menu     = $(this).closest('.menu-droite-pliable');
    const isPinned  = $menu.hasClass('has-select');

    // Close other menus unless pinned
    $('.menu-droite-pliable.deplie').not($menu).each(function () {
      const $other = $(this);
      if (!$other.hasClass('has-select')) {
        $other.removeClass('deplie');
      }
    });

    // Toggle current menu
    if ($menu.hasClass('deplie')) {
      if (!isPinned) {
        $menu.removeClass('deplie');
      }
    } else {
      $menu.addClass('deplie');
    }
  });


  /* ==================================================
     5) Click on .r-sub-titre (switch r-select)
     ================================================== */
  $(document).on('click', '.r-sub-titre', function () {
    // Move r-select
    $('.r-sub-titre').removeClass('r-select');
    $(this).addClass('r-select');

    // Update pinned menu + auto-close old one
    updateHasSelect();
  });

});
