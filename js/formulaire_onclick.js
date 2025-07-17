$(document).ready(function () {
    const ficheHTML = localStorage.getItem('fiche_a_editer');
    const ficheTitre = localStorage.getItem('fiche_titre');
    const ficheGroupe = localStorage.getItem('fiche_groupe');

    
    if (!ficheHTML) return;

    const $fiche = $('<div>').html(ficheHTML);

    // --- CHAMPS SIMPLES ---
    $('#prenom').val($fiche.find('.fiche_prenom_nom').text().trim());
    $('#groupe').val($fiche.find('.titre_groupe').text().trim());

    if (ficheTitre) {
        $('#titrefiche').val(ficheTitre);
        localStorage.removeItem('fiche_titre');
    }

    if (ficheGroupe) {
        $('.form_wrapper_contour.groupe_large').addClass(ficheGroupe);

        $('#groupe option, #groupe2 option')
            .removeAttr('selected')
            .removeClass('selected');

        $(`#groupe option#g_${ficheGroupe}`).attr('selected', 'selected').addClass('selected');
        $(`#groupe2 option#g_${ficheGroupe}`).attr('selected', 'selected').addClass('selected');

        localStorage.removeItem('fiche_groupe');
    }

    // --- FACTS ---
    const facts = $fiche.find('.f-facts');
    facts.each(function (i) {
        if (i > 0) $('.add_fact').last().click();
        $(`#fact${i}`).val($(this).text().trim());
    });

    // --- SIGNES PARTICULIERS ---
    const signes = $fiche.find('.f-signe');
    signes.each(function (i) {
        if (i > 0) $('.add_signes').last().click();
        $(`#signes${i}`).val($(this).text().trim());
    });

    // --- QUALITÉS / DÉFAUTS ---
    const qualiDefs = $fiche.find('.qd_reply');
    qualiDefs.each(function (i) {
        if (i > 0) $('.add_quali_def').last().click();
        $(`#quali_def${i}`).val($(this).text().trim());
    });

    // --- CHRONO ---
    const annees = $fiche.find('.fiche_f-annee');
    const mois = $fiche.find('.fiche_f-mois');
    const descs = $fiche.find('.fiche_f-desc');

    const chronoCount = Math.min(annees.length, mois.length, descs.length) - 1; // exclure "Maintenant"

    for (let i = 0; i < chronoCount; i++) {
        if (i > 0) $('.add_chrono').last().click();

        $(`#date_annee_${i}`).val(annees.eq(i).text().trim());
        $(`#date_mois_${i}`).val(mois.eq(i).text().trim());
        $(`#chrono_${i}`).val(descs.eq(i).text().trim());
    }

    // --- Dernier bloc "Maintenant"
    const lastIndex = chronoCount;
    $(`#chrono_${lastIndex}`).val(descs.eq(lastIndex).text().trim());

    // Nettoyer
    localStorage.removeItem('fiche_a_editer');
});
