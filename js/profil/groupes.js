document.addEventListener("DOMContentLoaded", function () {

  /* ================================
     Liste des groupes par couleur
     ================================ */
  const profilListeGrp = {
    '#326DE0': 'profil_deus',
    '#91B6FF': 'profil_pnj',
    '#D4113E': 'profil_vampire',
    '#C083CF': 'profil_hybride',
    '#6D9C72': 'profil_humain',
    '#FFCD61': 'profil_chimere',
    '#6E6E6E': 'profil_membre',
    '#D1D1D1': 'profil_inactif'
  };

  /* ================================
     Helper — extrait la couleur hex
     ================================ */
  function getHexColorFromStyle(el) {
    if (!el || !el.getAttribute('style')) return null;
    const match = el.getAttribute('style')
      .match(/#(?:[0-9a-f]{3}){1,2}/i);
    return match ? match[0].toUpperCase() : null;
  }

  /* ================================
     CAS 1 — profils (.profil-wrap)
     ================================ */
  document.querySelectorAll('.profil-wrap').forEach(profil => {

    const pseudoColore = profil.querySelector(
      '.profil-page-ttle [style*="color"]'
    );
    if (!pseudoColore) return;

    const couleur = getHexColorFromStyle(pseudoColore);
    if (!couleur || !profilListeGrp[couleur]) return;

    profil.classList.add(profilListeGrp[couleur]);
  });

  /* ================================
     CAS 2 — pages avec #cp-main
     h1.page-title span coloré
     ================================ */
  const cpMain = document.getElementById('cp-main');
  if (cpMain) {

    const titleSpan = cpMain.querySelector(
      'h1.page-title span[style*="color"]'
    );
    if (!titleSpan) return;

    const couleur = getHexColorFromStyle(titleSpan);
    if (!couleur || !profilListeGrp[couleur]) return;

    cpMain.classList.add(profilListeGrp[couleur]);
  }

});
