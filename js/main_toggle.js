$(document).ready(function () {
  const $menu = $('.mainmenu_lorebook .mainmenu');

  function showTargetFrom($link, skipScroll = false) {
    const targetId = $link.attr('href');
    const $target = $(targetId);

    // Update .select
    $menu.removeClass('select');
    $link.addClass('select');

    // Hide all target sections
    $menu.each(function () {
      const id = $(this).attr('href');
      if (id && id.startsWith('#') && $(id).length) {
        $(id).hide(); // ✅ safer than .css('display', 'none')
      }
    });

    // Show the target section
    if ($target.length) {
      $target.show(); // ✅ safer than .css('display', 'block')

      if (!skipScroll) {
        $('html, body').animate({
          scrollTop: $target.offset().top - 30
        }, 150);
      }
    }
  }

  // ✅ On page load: use URL hash if present
  const hash = window.location.hash;
  const $targetLink = hash
    ? $menu.filter(`[href="${hash}"]`)
    : $menu.filter('.select').first();

  if ($targetLink.length) {
    showTargetFrom($targetLink, true); // skip scroll on load
  }

  // ✅ On menu click: update URL and view
  $('.mainmenu_lorebook').on('click', '.mainmenu', function (e) {
    e.preventDefault();

    const $this = $(this);
    const href = $this.attr('href');

    // Already selected
    if ($this.hasClass('select')) return;

    // Update URL without reloading the page
    history.replaceState(null, null, href);

    showTargetFrom($this);
  });
});
