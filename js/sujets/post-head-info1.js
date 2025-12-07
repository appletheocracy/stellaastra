$(function () {

  // Petit délai pour être sûr que Forumactif ait fini d'injecter le contenu
  setTimeout(function () {

    /* ======================================================
     * 1) Insert group label based on parent post class
     * ====================================================== */
    $('.post-head .infos-posteur_globale').each(function () {
      const $globale = $(this);
      const $post = $globale.closest('.post');
      let groupText = '';

      if ($post.hasClass('message_deus')) groupText = 'Compte Fondateur';
      else if ($post.hasClass('message_pnj')) groupText = 'Compte PNJ';
      else if ($post.hasClass('message_membre')) groupText = 'Membre';
      else if ($post.hasClass('message_vampire')) groupText = 'Vampire';
      else if ($post.hasClass('message_humain')) groupText = 'Humain-e';
      else if ($post.hasClass('message_hybride')) groupText = 'Hybride';
      else if ($post.hasClass('message_chimere')) groupText = 'Chimère';

      if (groupText !== '') {
        const $newDiv = $('<div class="infos-posteur group-insert"></div>').text(groupText);
        const $first = $globale.find('.infos-posteur').first();

        $first.length ? $newDiv.insertBefore($first) : $globale.prepend($newDiv);
      }
    });

    /* ======================================================
     * 2) Age → add " ans"
     * ====================================================== */
    $('.infos-posteur_globale .field___00e2ge').each(function () {
      const t = $.trim($(this).text());
      if (t && !t.endsWith('ans')) $(this).text(t + ' ans');
    });

    /* ======================================================
     * 3) Taille → add "mesure "
     * ====================================================== */
    $('.infos-posteur_globale .field_taille').each(function () {
      const t = $.trim($(this).text());
      if (t && !t.toLowerCase().startsWith('mesure ')) $(this).text('mesure ' + t);
    });

    /* ======================================================
     * 4) Corpulence → add "de corpulence "
     * ====================================================== */
    $('.infos-posteur_globale .field_corpulence').each(function () {
      const t = $.trim($(this).text());
      if (t && !t.toLowerCase().startsWith('de corpulence')) $(this).text('de corpulence ' + t);
    });

    /* ======================================================
     * 5) RPS → add " RPS" 
     *     (selector corrected: .field_rps only)
     * ====================================================== */
    $('.infos-posteur_globale .field_rps').each(function () {
      const t = $.trim($(this).text());
      if (t && !t.toLowerCase().endsWith('rps')) $(this).text(t + ' RPS');
    });

  }, 50); // délai léger pour forumactif connecté
});
