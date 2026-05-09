$(function () {
    $('.profil-fiche-wrapper').each(function () {
            var $wrap = $(this);

        var params = new URLSearchParams(window.location.search);
            var showuser = params.get('showuser');
        
            if (showuser !== null) {
                $('#innerwrapper').addClass('fiche_utili');
            }

        $('#sc-fiche-perso .espece-h').each(function () {
                let $el = $(this);
                let txt = $el.text().trim().toLowerCase();

                if (txt === 'membre') {
                    $el.text('à Valider').addClass('valid');
                }
            });


            $wrap.find('.chronologie').each(function () {
                var $chrono = $(this);
                var html = $chrono.html();

                if (!html || html.indexOf('[') === -1) return;

                var matches = html.match(/\[([\s\S]*?)\]/g);
                if (!matches) return;

                var items = matches.map(function (item) {
                    return item.replace(/^\[/, '').replace(/\]$/, '');
                });

                var result = '';

                for (var i = 0; i < items.length;) {
                    var annee = '';
                    var mois = '';
                    var description = '';

                    if (i < items.length) {
                        annee = $.trim(items[i]);
                        i++;
                    }

                    var remaining = items.length - i;

                    if (remaining >= 2) {
                        mois = $.trim(items[i]);
                        description = items[i + 1];
                        i += 2;
                    } else if (remaining === 1) {
                        description = items[i];
                        i += 1;
                    }

                    var anneeValide = /^\d{1,4}$/.test(annee);
                    var moisNettoye = $.trim(mois);
                    var moisValide = moisNettoye.length > 0;
                    var moisTropLong = moisNettoye.length > 20;

                    var descriptionValide = $.trim(
                        String(description)
                            .replace(/<br\s*\/?>/gi, '')
                            .replace(/&nbsp;/gi, '')
                    ) !== '';

                    result += '<div class="bloc-chrono">';
                    result += '<div class="date-chrono">';

                    // année
                    if (anneeValide) {
                        result += '<div class="annee">' + annee + '</div>';
                    } else {
                        result += '<div class="annee erreur">ERREUR</div>';
                    }

                    // mois / saison
                    if (!moisValide) {
                        result += '<div class="mois-saison"></div>';
                    } else if (moisTropLong) {
                        result += '<div class="mois-saison erreur">ERREUR<br/>Trop long</div>';
                    } else {
                        result += '<div class="mois-saison">' + mois + '</div>';
                    }

                    result += '</div>';

                    // description
                    if (descriptionValide) {
                        result += '<div class="description">' + description + '</div>';
                    } else {
                        result += '<div class="description erreur">À remplir</div>';
                    }

                    result += '</div>';
                }

                $chrono.html(result);

                $chrono.find('.bloc-chrono:last').addClass('last-bloc');
            });

            //ONGLETS DROITE
            // ONGLETS DROITE - scroll natif plus fluide
            $wrap.find('.informations-compte .pf-onglets-droite a[href^="#"]')
                .off('click.ongletsDroite')
                .on('click.ongletsDroite', function (e) {
                    var href = $(this).attr('href');
                    var target = href ? $wrap.find(href)[0] : null;

                    if (!target) return;

                    e.preventDefault();

                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });        

            var $links = $wrap.find('.onglets-wrap a');

            // 🔹 init si rien n’est sélectionné
            if (!$links.filter('.select-o').length) {
                $links.first().addClass('select-o');
            }

            // 🔹 click
            $wrap.find('.onglets-wrap').on('click', 'a', function () {
                $links.removeClass('select-o');
                $(this).addClass('select-o');
            });


            // MENU GAUCHE
            var $menuGaucheLinks = $wrap.find('.pf-menu-gauche a[href^="#"]');

            function initMenuGauche() {
                var $visibleMenuLinks = $menuGaucheLinks.filter(function () {
                    return $(this).is(':visible') && $(this).closest('.undisplayed').length === 0;
                });

                var $sectionsCompte = $menuGaucheLinks.map(function () {
                    var href = $(this).attr('href');
                    return $wrap.find(href).get();
                });

                $menuGaucheLinks.removeClass('select-o');
                $sectionsCompte.addClass('undisplayed');

                var $firstVisibleLink = $visibleMenuLinks.first();

                if ($firstVisibleLink.length) {
                    $firstVisibleLink.addClass('select-o');

                    var firstTarget = $firstVisibleLink.attr('href');

                    if (firstTarget && $wrap.find(firstTarget).length) {
                        $wrap.find(firstTarget).removeClass('undisplayed');
                    }
                }
            }

            initMenuGauche();

            setTimeout(initMenuGauche, 50);
            setTimeout(initMenuGauche, 300);

            $menuGaucheLinks.off('click.menuGauche').on('click.menuGauche', function (e) {
                e.preventDefault();

                var $link = $(this);

                if (!$link.is(':visible') || $link.closest('.undisplayed').length) return;

                var target = $link.attr('href');

                if (!target || !$wrap.find(target).length) return;

                $menuGaucheLinks.removeClass('select-o');

                var $sectionsCompte = $menuGaucheLinks.map(function () {
                    var href = $(this).attr('href');
                    return $wrap.find(href).get();
                });

                $sectionsCompte.addClass('undisplayed');

                $link.addClass('select-o');
                $wrap.find(target).removeClass('undisplayed');
            });


            //NO INFORMATION
            $wrap.find('i').each(function () {
                var txt = $(this).text();

                if (txt.toLowerCase().includes('no information')) {
                    $(this).text(txt.replace(/no information/gi, 'N/A'));
                }
            });

            
            function splitIntoBlocks($container, itemClass, maxItems, allowHTML) {
                if (!$container.length) return;

                $container.each(function () {
                    var $el = $(this);

                    var rawHTML = $el
                        .html()
                        .replace(/<br\s*\/?>/gi, ';')
                        .replace(/&nbsp;/gi, ' ')
                        .trim();

                    var items = rawHTML
                        .split(';')
                        .map(function (item) {
                            item = item.trim();

                            // 🔹 HTML autorisé → nettoyage SAFE (whitelist)
                            if (allowHTML) {
                                item = item.replace(/<(?!\/?(b|i|u|em|strong|span|br)\b)[^>]*>/gi, '');
                            }

                            // 🔹 HTML NON autorisé → strip complet
                            else {
                                item = $('<div>').html(item).text().trim();
                            }

                            return item;
                        })
                        .filter(function (item) {
                            return item.length > 0;
                        });

                    if (typeof maxItems === 'number') {
                        items = items.slice(0, maxItems);
                    }

                    $el.empty();

                    items.forEach(function (item) {
                        $('<div>', {
                            class: itemClass,
                            html: allowHTML ? item : undefined,
                            text: !allowHTML ? item : undefined
                        }).appendTo($el);
                    });
                });
            }

            // FACTS → HTML autorisé
            splitIntoBlocks(
                $('.bloc-info.facts .information-bloc'),
                'ib-facts',
                null,
                true
            );

            // SIGNES → HTML autorisé
            splitIntoBlocks(
                $('.bloc-info.signes .information-bloc'),
                'ib-signes',
                null,
                true
            );

            // QUALITÉS / DÉFAUTS → HTML interdit
            splitIntoBlocks(
                $('.bloc-fiche.caractere .qualite-defaut'),
                'bloc-qd',
                12,
                false
            );

            // CONTENT WARNINGS → HTML autorisé
            splitIntoBlocks(
                $('.wrapper-j-info.cw .info-rep-bloc'),
                'cw-joueur',
                1000,
                true
            );

            $wrap.find('.histoire').each(function () {            
                var $histoire = $(this);
                var $textarea = $histoire.find('.fiche-textarea');

                if (!$textarea.length) return;

                $histoire.find('i').filter(function () {
                    return $(this).text().toLowerCase().includes('n/a');
                }).remove();

                // Nettoyage du contenu (ignore <br>, &nbsp;, espaces)
                var content = $textarea.html()
                    .replace(/<br\s*\/?>/gi, '')
                    .replace(/&nbsp;/gi, '')
                    .trim();

                if (content === '') {
                    $histoire.remove();
                }
            });
            

            function isInvalidSrc(src) {
                if (!src) return true;

                src = src.trim();

                return (
                    src === '' ||
                    src === 'https://' ||
                    src === '#' ||
                    src.length < 10 || // évite "abc", "test", etc.
                    !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(src)
                );
            }

            function applyFallback($imgs, fallback) {
                $imgs.each(function () {
                    let $img = $(this);

                    if ($img.data('fallback-bound')) return;
                    $img.data('fallback-bound', true);

                    function setFallback() {
                        if ($img.attr('src') !== fallback) {
                            $img
                                .attr('src', fallback)
                                .addClass('img-fallback');
                        }
                    }

                    // 🔸 erreur de chargement réelle
                    $img.on('error', setFallback);

                    // 🔸 validation immédiate du src
                    let src = $img.attr('src');

                    if (isInvalidSrc(src)) {
                        setFallback();
                    }
                });
            }

            function runFallbacks() {

                // 🔹 joueur + enrp
                applyFallback(
                    $wrap.find('#sc-fiche-joueur .overflow-img img, #sc-fiche-enrp .overflow-img img'),
                    'https://i.imgur.com/pGUeQgA.png'
                );

                // 🔹 fiche perso
                applyFallback(
                    $wrap.find('#sc-fiche-perso .img-fiche1 img'),
                    'https://i.imgur.com/vY1VicK.png'
                );

                applyFallback(
                    $wrap.find('#sc-fiche-perso .fg-image img'),
                    'https://i.imgur.com/NmI1JpR.png'
                );

                applyFallback(
                    $wrap.find('#sc-fiche-perso .avatar-poli img'),
                    'https://i.imgur.com/5xCrIxe.png'
                );
            applyFallback(
                    $wrap.find('#avatar-switcheroo-sc img'),
                    'https://https://i.imgur.com/KLJ1PCg.png'
                );
            }

            // 🔹 initial
            runFallbacks();

            // 🔹 observe les changements dans CE wrapper
            let observer = new MutationObserver(function () {
                runFallbacks();
            });

            observer.observe($wrap[0], {
                childList: true,
                subtree: true
            });

            $wrap.find('.pf-menu-gauche a').each(function () {
                var $a = $(this);
                var href = ($a.attr('href') || '').trim().toLowerCase();

                if (
                    !href || 
                    href.includes('no information') ||
                    href.includes('<i>')
                ) {
                    $a.attr('href', '#');
                }
            });

        $wrap.find('.espece-h').each(function () {
            var txt = $(this).text();
            $(this).text(txt.replace(/\s*\[H\]\s*/gi, ''));
        });

            // CLASSE COMPTE SELON FIELD_11 / TARGETTING11
            var rawTarget = $.trim($wrap.find('#targetting11').text());

            var normalizedTarget = rawTarget
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();

            var compteMap = {
                'principal & inactif': 'compte-principal-inactif',
                'principal': 'compte-principal',
                'vampyr': 'compte-vampire',
                'kymaere': 'compte-chimere',
                'menneske': 'compte-humain',
                'hybrid': 'compte-hybride',
                'strigoi': 'compte-strigoi',
                'staff': 'compte-staff',
                'deus': 'compte-deus',
                'pnj': 'compte-pnj',
                'inactif': 'compte-inactif'
            };

            var compteAdded = false;

            $.each(compteMap, function (label, className) {
                if (normalizedTarget.indexOf(label) !== -1) {
                    $wrap.addClass(className);
                    compteAdded = true;
                }
            });

            // Si une vraie classe compte-* a été ajoutée, on enlève compte-membre
            if (compteAdded) {
                $wrap.removeClass('compte-membre');
            }

            // Si rien n’a matché, on garde/ajoute compte-membre
            else {
                $wrap.addClass('compte-membre');
            }
    });


    $.get('/index.php?act=ST&f=52&t=25', function (data) {

        var $doc = $('<div>').html(data);

        var currentDate = $doc
            .find('.postcolor #date-forum-age')
            .first()
            .text()
            .trim();

        if (!currentDate) return;

        // =========================
        // DATE DE NAISSANCE PROFIL
        // =========================
        var birthText = $('.bloc-info.ddn .information-bloc')
            .first()
            .text()
            .trim();

        if (!birthText) return;

        // =========================
        // PARSE DATE FLEXIBLE
        // =========================
        function parseFRDate(str) {

            str = str.trim();

            // année seule
            if (/^\d{4}$/.test(str)) {

                return {
                    day: 1,
                    month: 1,
                    year: parseInt(str, 10)
                };
            }

            // jj/mm/aaaa ou j/m/aaaa
            var match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

            if (!match) return null;

            return {
                day: parseInt(match[1], 10),
                month: parseInt(match[2], 10),
                year: parseInt(match[3], 10)
            };
        }

        var birth = parseFRDate(birthText);
        var current = parseFRDate(currentDate);

        if (!birth || !current) return;

        // =========================
    // CALCUL ÂGE
    // =========================
    var age = current.year - birth.year;
    
    if (
        current.month < birth.month ||
        (
            current.month === birth.month &&
            current.day < birth.day
        )
    ) {
        age--;
    }
    
    if (age < 0) age = 0;
    
    // =========================
    // FORMAT ÂGE
    // =========================
    var finalAge = age > 2500 ? '∞' : age;
    
    // =========================
    // INSERTION
    // =========================
    $('.bloc-info.age-app3 .information-bloc span.age-an')
        .text(finalAge);

    });

});
