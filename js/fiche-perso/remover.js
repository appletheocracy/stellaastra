//RETIRE HISTOIRE SI VIDE & STYLE LA CHRONO
$(document).ready(function () {
    $('.histoire_texte').each(function () {
        if ($.trim($(this).html()) === '') {
            $(this).closest('.f-history').hide();
        }
    });
  $('.qd_reply').each(function () {
        if ($.trim($(this).html()) === '') {
            $(this).hide();
        }
  });
    var content = $('.fiche_prenom_nom').html(); // get content
    $('.fiche_prenom_nom1').html(content); // set content 
  
   const anneMoisElements = document.querySelectorAll('.f-anne-mois');
    if (anneMoisElements.length) {
        anneMoisElements[anneMoisElements.length - 1].classList.add('last-timeline-block');
    }

});
