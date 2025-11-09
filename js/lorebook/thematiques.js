$(function () {
  const baseUrl = 'https://stella-cinis.forumactif.com/h26-modificateur';

  function loadOrFallback(targetId, sourceId) {
    const $target = $('#' + targetId);

    $target.load(baseUrl + ' #' + sourceId + ' > *', function (response, status) {
      if (status === 'error' || !$target.html().trim()) {
        $target.html('<em>Information à venir.</em>');
      }
    });
  }

  loadOrFallback('thema-recurrentes', 'liste_recurrentes');
  loadOrFallback('thema-pas-assez', 'liste_pas-assez');
  loadOrFallback('thema-groupes', 'liste_groupes');
});
