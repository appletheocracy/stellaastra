$(document).ready(function () {
    const ficheHTML = localStorage.getItem('fiche_a_editer');

    if (ficheHTML) {
        // Transformer le HTML en élément jQuery pour extraction facile
        const $fiche = $('<div>').html(ficheHTML);

        // Exemples : remplir des inputs avec les valeurs extraites
        $('#prenom').val($fiche.find('.fiche_prenom_nom').text().trim());
        $('#groupe').val($fiche.find('.titre_groupe').text().trim());

        // Boucles pour facts, signes, chrono, quali_def selon le nombre trouvé
        $fiche.find('.f-facts').each(function (i) {
            // Générer dynamiquement des champs si nécessaires, puis :
            $(`#fact${i}`).val($(this).text().trim());
        });

        $fiche.find('.f-signe').each(function (i) {
            $(`#signes${i}`).val($(this).text().trim());
        });

        $fiche.find('.qd_reply').each(function (i) {
            $(`#quali_def${i}`).val($(this).text().trim());
        });

        $fiche.find('.f-anne-mois').each(function (i) {
            const annee = $(this).find('.fiche_f-annee').text().trim();
            const mois = $(this).find('.fiche_f-mois').text().trim();
            const desc = $fiche.find('.fiche_f-desc').eq(i).text().trim();

            $(`#date_annee_${i}`).val(annee);
            $(`#date_mois_${i}`).val(mois);
            $(`#chrono_${i}`).val(desc);
        });

        // Nettoyage du localStorage après usage
        localStorage.removeItem('fiche_a_editer');
    }
});
