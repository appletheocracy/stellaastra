$(function () {

  /* ============================================================
   * 1) Insert group label based on parent .post class
   * ============================================================ */
  $('.post-head .infos-posteur_globale').each(function () {
    var $bloc = $(this);
    var $post = $bloc.closest('.post');
    var label = null;

    if ($post.hasClass('message_deus')) {
      label = 'Compte Fondateur';
    } else if ($post.hasClass('message_pnj')) {
      label = 'Compte PNJ';
    } else if ($post.hasClass('message_membre')) {
      label = 'Membre';
    } else if ($post.hasClass('message_vampire')) {
      label = 'Vampire';
    } else if ($post.hasClass('message_humain')) {
      label = 'Humain-e';
    } else if ($post.hasClass('message_hybride')) {
      label = 'Hybride';
    } else if ($post.hasClass('message_chimere')) {
      label = 'Chimère';
    }

    if (label) {
      var $insert = $('<div class="infos-posteur group-insert"></div>').text(label);
      var $firstInfo = $bloc.find('.infos-posteur').first();

      if ($firstInfo.length) {
        $insert.insertBefore($firstInfo);
      } else {
        $insert.prependTo($bloc);
      }
    }
  });

  /* ============================================================
   * 2) Age → add " ans" at the end
   *    <div class="infos-posteur field___00e2ge">9999 ans</div>
   * ============================================================ */
  $('.infos-posteur_globale .field___00e2ge').each(function () {
    var $el  = $(this);
    var text = $.trim($el.text());
    if (text && !/ans$/i.test(text)) {
      $el.text(text + ' ans');
    }
  });

  /* ============================================================
   * 3) Taille → add "mesure " before the content
   *    <div class="infos-posteur field_taille">mesure 9999</div>
   * ============================================================ */
  $('.infos-posteur_globale .field_taille').each(function () {
    var $el  = $(this);
    var text = $.trim($el.text());
    if (text && !/^mesure\b/i.test(text)) {
      $el.text('mesure ' + text);
    }
  });

  /* ============================================================
   * 4) Corpulence → add "de corpulence " before the content
   *    <div class="infos-posteur field_corpulence">de corpulence 9999</div>
   * ============================================================ */
  $('.infos-posteur_globale .field_corpulence').each(function () {
    var $el  = $(this);
    var text = $.trim($el.text());
    if (text && !/^de corpulence\b/i.test(text)) {
      $el.text('de corpulence ' + text);
    }
  });

  /* ============================================================
   * 5) RPS → add " RPS" at the end
   *    <div class="infos-posteur field_rps">9999 RPS</div>
   *    (handles both field___rps & field_rps just in case)
   * ============================================================ */
  $('.infos-posteur_globale .field___rps, .infos-posteur_globale .field_rps').each(function () {
    var $el  = $(this);
    var text = $.trim($el.text());
    if (text && !/RPS$/i.test(text)) {
      $el.text(text + ' RPS');
    }
  });

});
