$(function() {
    var id = _userdata.user_id,
        l = _userdata.user_level,
        g = '/g8-',
        gp2 = '/g13-?start=50',
        $hides = $('.post .content hide');

    // Par défaut, cacher
    $hides.removeClass('show');

    if (l != 0) {
        // Admin/staff
        $hides.addClass('show');
    } else if (id != -1) {
        // Membre connecté : vérifier appartenance
        $.get(g).done(function(data) {
            var inGroup = $(data).find('a[href="/u' + id + '"]').length;
            if (inGroup) {
                $hides.addClass('show');
            } else {
                // Page suivante
                $.get(gp2).done(function(data2) {
                    inGroup = $(data2).find('a[href="/u' + id + '"]').length;
                    if (inGroup) {
                        $hides.addClass('show');
                    }
                    // sinon, on ne fait rien (reste masqué)
                });
            }
        });
    }
});
