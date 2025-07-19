$(document).ready(function () {

  $('.rules-sub-menu').on('click', '.r-sub-titre', function (e) {
    // If this element is already selected, do nothing
    if ($(this).hasClass('r-select')) return;

    // Remove r-select from all, add to clicked one
    $('.rules-sub-menu .r-sub-titre').removeClass('r-select');
    $(this).addClass('r-select');
  });

    $('.rules-sub-menu').on('click', '.r-sub-titre', function (e) {
    e.preventDefault(); // prevent default anchor behavior

    const $this = $(this);
    const targetId = $this.attr('href');
    const $target = $(targetId);

    // Avoid unnecessary toggle if already selected
    if (!$this.hasClass('r-select')) {
      $('.rules-sub-menu .r-sub-titre').removeClass('r-select');
      $this.addClass('r-select');
    }

    // Scroll to the target with 30px top offset
    if ($target.length) {
      const offset = $target.offset().top - 30;

      $('html, body').animate({
        scrollTop: offset
      }, 100); // smooth scroll
    }
  });
});
