$(function () {

  const SOURCE_URL = 'https://stella-cinis.forumactif.com/t53-idees-de-personnages';

  // Helper → copy innerHTML from src selector to dest selector
  function copySection($dom, srcSel, destSel) {
    const $src  = $dom.find(srcSel).first();
    const $dest = $(destSel).first();

    if (!$dest.length) return; // destination does not exist

    if ($src.length) {
      const inner = ($src.html() || "").trim();
      if (inner) {
        $dest.html(inner);
        return;
      }
    }

    // Fallback if empty or missing
    $dest.html('<div>Information à venir.</div>');
  }

  // Fetch page and apply transfers
  $.ajax({
    url: SOURCE_URL,
    dataType: 'html',
    timeout: 20000
  })
  .done(function (html) {
    const $dom = $('<div>').append($.parseHTML(html));

    copySection($dom, '#thema_rec',      '#thema-recurrentes');
    copySection($dom, '#milieux_sous_ex','#thema-pas-assez');
    copySection($dom, '#groupe_a_fav',   '#thema-groupes');
  })
  .fail(function () {
    // If entire request fails, fill all with fallback
    $('#thema-recurrentes').html('<div>Information à venir.</div>');
    $('#thema-pas-assez').html('<div>Information à venir.</div>');
    $('#thema-groupes').html('<div>Information à venir.</div>');
  });

});
