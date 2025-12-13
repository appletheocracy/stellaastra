document.addEventListener("DOMContentLoaded", function() {
    // La liste des groupes
    const profilListeGrp = {
        '#326DE0': 'ldeu',
        '#91B6FF': 'lpnj',
        '#D4113E': 'lvamp',
        '#C083CF': 'lhybr',
        '#6D9C72': 'lhuma',
        '#FFCD61': 'lchim',
        '#D1D1D1': 'linac',
        '#6E6E6E': 'lmemb'
    };
    const listingWrapper = '.liste-ctn-rpt-col';
    const listingPseudo = '.liste-u-name';
    
    // Pour chaque profil d'un sujet
    document.querySelectorAll(listingWrapper).forEach(profil => {
      const listingColore = profil.querySelector(listingPseudo + ' [style^="color"]');
      if(listingColore) { // Si on trouve un pseudo coloré
          let listColPseudo = listingColore.getAttribute('style').match(/#(?:[0-9a-f]{3}){1,2}/i)[0];
          profil.classList.add(profilListeGrp[listColPseudo]); 
        }
    });
});
