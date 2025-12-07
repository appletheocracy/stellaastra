//SCRIPT QUI PERMET DE FAIRE DES ITÉRATIONS DANS LA FICHE C'EST LE COMPTEUR POUR PERMETTRE L'ÉDITION.

$(function () {
  /* ========= 1) annee#/mois# on fiche_f-annee / fiche_f-mois (INCLUDES .last-timeline-block) ========= */
  function indexAnneeMois(ctx) {
    var idx = 0;

    $(ctx).find('.f-anne-mois').each(function () {
      var $block = $(this);
      var $annee = $block.find('.fiche_f-annee').first();
      var $mois  = $block.find('.fiche_f-mois').first();

      // Skip empty placeholder rows (no content in both)
      var hasAny =
        ($annee.length && $.trim($annee.text()).length) ||
        ($mois.length  && $.trim($mois.text()).length);
      if (!hasAny) return;

      if ($annee.length) {
        $annee.removeClass(function (i, c) {
          return (c && c.match(/\bannee\d+\b/g)) ? c.match(/\bannee\d+\b/g).join(' ') : '';
        }).addClass('annee' + idx);
      }

      if ($mois.length) {
        $mois.removeClass(function (i, c) {
          return (c && c.match(/\bmois\d+\b/g)) ? c.match(/\bmois\d+\b/g).join(' ') : '';
        }).addClass('mois' + idx);
      }

      idx++;
    });
  }

  /* ========= 2) Generic enumerator: adds classPrefix# and sets idPrefix# if safe ========= */
  function indexElements(ctx, selector, classPrefix, idPrefix) {
    var i = 0;
    var reClass = new RegExp('\\b' + classPrefix + '\\d+\\b', 'g');
    var reId    = new RegExp('^' + idPrefix + '\\d+$');

    $(ctx).find(selector).each(function () {
      var $el = $(this);

      // Clean old classPrefix#
      $el.removeClass(function (_, c) {
        if (!c) return '';
        var hits = c.match(reClass);
        return hits ? hits.join(' ') : '';
      });

      // Add classPrefix#
      $el.addClass(classPrefix + i);

      // Set/refresh id only if absent or previously using the same enumerated pattern
      var oldId = $el.attr('id');
      if (!oldId || reId.test(oldId)) {
        $el.attr('id', idPrefix + i);
      }

      i++;
    });
  }

  // ===== Initial runs =====
  indexAnneeMois(document);

  // qd_reply → qd0, qd1, ...
  indexElements(document, 'div.qd_reply', 'qd', 'qd');

  // f-facts → fact0, fact1, ...
  indexElements(document, 'div.f-facts', 'fact', 'fact');

  // f-signe → sig0, sig1, ...
  indexElements(document, 'div.f-signe', 'sig', 'sig');

  // fiche_f-desc → desc0, desc1, ...
  indexElements(document, 'div.fiche_f-desc', 'desc', 'desc');

  // NEW: bloc_rep_fiche → bloc0, bloc1, ...
  indexElements(document, 'div.bloc_rep_fiche', 'bloc', 'bloc');

  // Re-run these after dynamic DOM updates if needed:
  // indexAnneeMois(document);
  // indexElements(document, 'div.qd_reply', 'qd', 'qd');
  // indexElements(document, 'div.f-facts', 'fact', 'fact');
  // indexElements(document, 'div.f-signe', 'sig', 'sig');
  // indexElements(document, 'div.fiche_f-desc', 'desc', 'desc');
  // indexElements(document, 'div.bloc_rep_fiche', 'bloc', 'bloc');
});
