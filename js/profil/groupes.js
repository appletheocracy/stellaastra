document.addEventListener("DOMContentLoaded", function() {
    // La liste des groupes
    const profilListeGrp = {
        '#326DE0': 'profil_deus',
        '#91B6FF': 'profil_pnj',
        '#D4113E': 'profil_vampire',
        '#C083CF': 'profil_hybride',
        '#6D9C72': 'profil_humain',
        '#FFCD61': 'profil_chimere',
        '#6E6E6E': 'profil_membre'
    };
    const profileWrapper = '.profil-wrap';
    const profilePseudo = '.profil-page-ttle';
    
    // Pour chaque profil d'un sujet
    document.querySelectorAll(profileWrapper).forEach(profil => {
      const pseudoColore = profil.querySelector(profilePseudo + ' [style^="color"]');
      if(pseudoColore) { // Si on trouve un pseudo coloré
          let couleurPseudo = pseudoColore.getAttribute('style').match(/#(?:[0-9a-f]{3}){1,2}/i)[0];
          profil.classList.add(profilListeGrp[couleurPseudo]); 
        }
    });
});
