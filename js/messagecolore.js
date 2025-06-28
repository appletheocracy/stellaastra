document.addEventListener("DOMContentLoaded", function() {
    // La liste des groupes
    const listeGroupes = {
        '#326DE0': 'message_deus',
        '#FFCD61': 'message_pnj',
        '#D4113E': 'message_vampire',
        '#C083CF': 'message_hybride',
        '#6D9C72': 'message_humain'
    };
    const selecteurPost = '.post';
    const selecteurPseudo = '.posterName'
    
    // Pour chaque message d'un sujet
    document.querySelectorAll(selecteurPost).forEach(message => {
      const pseudoColore = message.querySelector(selecteurPseudo + ' [style^="color"]');
      if(pseudoColore) { // Si on trouve un pseudo coloré
          let couleurPseudo = pseudoColore.getAttribute('style').match(/#(?:[0-9a-f]{3}){1,2}/i)[0];
          message.classList.add(listeGroupes[couleurPseudo]); 
        }
    });
});
