$(function () {

  /* =========================================================
     0) Convert custom carnet wrappers (global, runs once)
     ========================================================= */
  $('carnet-humain').replaceWith(function () {
    return $('<div>', { class: 'carnet humain', html: $(this).html() });
  });
  $('carnet-vampire').replaceWith(function () {
    return $('<div>', { class: 'carnet vampire', html: $(this).html() });
  });
  $('carnet-hybride').replaceWith(function () {
    return $('<div>', { class: 'carnet hybride', html: $(this).html() });
  });
  $('carnet-chimere').replaceWith(function () {
    return $('<div>', { class: 'carnet chimere', html: $(this).html() });
  });
  $('carnet-eveille').replaceWith(function () {
    return $('<div>', { class: 'carnet eveille', html: $(this).html() });
  });
  $('carnet').replaceWith(function () {
    return $('<div>', { class: 'carnet', html: $(this).html() });
  });

  /* =========================================================
     1) Process EACH carnet independently (scoped per post)
     ========================================================= */
  $('div.post div.carnet').each(function () {
    var $carnet = $(this);
    var $post = $carnet.closest('div.post');

    /* ---------------------------------------------------------
       A) Convert your remaining custom tags -> div.classname
       (ONLY inside this carnet)
       --------------------------------------------------------- */
    $.each(
      ['cw', 'rep', 'daterp', 'linkrp', 'titrerp', 'annuaire', 'date-rp', 'titre-rp', 'en-cours', 'termine', 'repertoire'],
      function (_, tag) {
        $carnet.find(tag).each(function () {
          var $el = $(this);
          $('<div>', { class: tag, html: $el.html() }).replaceAll($el);
        });
      }
    );

    /* ---------------------------------------------------------
       B) Custom element conversions (ONLY inside this carnet)
       --------------------------------------------------------- */
    $carnet.find('nom-compte').replaceWith(function () {
      return $('<div>', { class: 'subtitle', html: $(this).html() });
    });
    $carnet.find('joueur').replaceWith(function () {
      return $('<div>', { class: 'featuser', html: $(this).html() });
    });
    $carnet.find('content-warnings').replaceWith(function () {
      return $('<div>', { class: 'carnet-cw', html: $(this).html() });
    });

    $carnet.find('dispo').replaceWith(function () {
      return $('<div>', { class: 'info disponi', html: $(this).html() });
    });

    $carnet.find('entete').replaceWith(function () {
      return $('<div>', { class: 'entete', html: $(this).html() });
    });

    $carnet.find('reservations').replaceWith(function () {
      return $('<div>', { class: 'info resa', html: $(this).html() });
    });

    $carnet.find('dialogues').replaceWith(function () {
      return $('<div>', { class: 'info dialogues', html: $(this).html() });
    });

    $carnet.find('rp').replaceWith(function () {
      return $('<div>', { class: 'rpdata', html: $(this).html() });
    });

    $carnet.find('a-venir').replaceWith(function () {
      return $('<div>', { class: 'rpdata tag-futur', html: $(this).html() });
    });

    $carnet.find('nom-lien').replaceWith(function () {
      return $('<div>', { class: 'rep', html: $(this).html() });
    });

    $carnet.find('lien').replaceWith(function () {
      return $('<div>', { class: 'perso', html: $(this).html() });
    });

    $carnet.find('description').replaceWith(function () {
      return $('<div>', { class: 'descrep', html: $(this).html() });
    });

    $carnet.find('liens-predefs').replaceWith(function () {
      return $('<div>', { class: 'liensrech', html: $(this).html() });
    });

    $carnet.find('preference-com').replaceWith(function () {
      return $('<div>', { class: 'info requete', html: $(this).html() });
    });

    $carnet.find('predefini-attendu').replaceWith(function () {
      return $('<div>', { class: 'info predef', html: $(this).html() });
    });

    $carnet.find('prelien-attendu').replaceWith(function () {
      return $('<div>', { class: 'info prel', html: $(this).html() });
    });

    $carnet.find('type-lien').replaceWith(function () {
      return $('<div>', { class: 'nm', html: $(this).html() });
    });

    $carnet.find('description-lien').replaceWith(function () {
      return $('<div>', { class: 'descnm', html: $(this).html() });
    });

    $carnet.find('prelien').replaceWith(function () {
      return $('<div>', { class: 'lienq', html: $(this).html() });
    });

    /* ---------------------------------------------------------
       C) Wrap main blocks into .contenu (ONLY inside this carnet)
       --------------------------------------------------------- */
    $carnet
      .find('.entete, .subtitle.bar, .annuaire, .repertoire, .liensrech')
      .wrapAll('<div class="contenu"></div>');

    $carnet.find('div.contenu').each(function () {
      if ($(this).prev('.title').length) return;
      $('<div class="title">Carnet de route</div>').insertBefore(this);
    });

    /* =========================================================
       ENTETE
       ========================================================= */
    $carnet.find('div.entete').each(function () {
      var $entete = $(this);

      // Wrap each featuser into .carnet-cw (within entete)
      $entete.find('div.featuser').each(function () {
        var $feat = $(this);
        if ($feat.parent().hasClass('carnet-cw')) return;

        var $st3 = $feat.prev('st3');
        if ($st3.length && $st3.text().trim() === 'Joué par:') {
          $st3.add($feat).wrapAll('<div class="carnet-cw"></div>');
          return;
        }

        $('<st3>Joué par:</st3>').insertBefore($feat);
        $feat.prev('st3').add($feat).wrapAll('<div class="carnet-cw"></div>');
      });

      // Add CW title inside each carnet-cw (within entete)
      $entete.find('div.carnet-cw').each(function () {
        var $wrap = $(this);
        var $cw = $wrap.find('div.cw');

        if ($cw.length) {
          if (
            !$wrap.children('st3').filter(function () {
              return $(this).text().trim() === 'CW Joués:';
            }).length
          ) {
            $('<st3>CW Joués:</st3>').insertBefore($cw.first());
          }
        }
      });

      // Wrap subtitle + following carnet-cw into .info_entete (within entete)
      $entete.children('div.subtitle').each(function () {
        var $subtitle = $(this);
        var $group = $subtitle.nextUntil('div.subtitle', 'div.carnet-cw').addBack();
        if ($subtitle.parent().hasClass('info_entete')) return;
        $group.wrapAll('<div class="info_entete"></div>');
      });

      // Wrap images in ttimg (within this carnet)
      $carnet.find('img').each(function () {
        if (!$(this).parent().hasClass('ttimg')) {
          $(this).wrap('<div class="ttimg"></div>');
        }
      });
    });

    /* =========================================================
       ANNUAIRE
       ========================================================= */
    $carnet.find('div.entete').each(function () {
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;
      $('<div class="subtitle bar">Annuaire des roles plays</div>').insertAfter(this);
    });

    $carnet.find('div.annuaire').each(function () {
      var $annuaire = $(this);

      // Dispos
      $annuaire.find('div.disponi').each(function () {
        var $dispo = $(this);
        if ($dispo.closest('.opt-top').length) return;

        var $info = $('<div class="infodata">Disponibilités</div>');
        $dispo.after($info);

        $dispo.add($info).wrapAll('<div class="info dispo dispowrap"></div>');
        var $infoDispo = $dispo.parent();

        var $subtitle = $('<div class="subtitle">Disponibilités</div>');
        $infoDispo.before($subtitle);

        $subtitle.add($infoDispo).wrapAll('<div class="opt-top dispo1"></div>');
      });

      // Réservations
      $annuaire.find('div.resa').each(function () {
        var $resa = $(this);
        if ($resa.closest('.opt-top').length) return;

        var $subtitle = $('<div class="subtitle">Réservations</div>');
        $resa.before($subtitle);

        $subtitle.add($resa).wrapAll('<div class="opt-top reser1"></div>');
      });

      // Dialogues
      $annuaire.find('div.dialogues').each(function () {
        var $dlg = $(this);
        if ($dlg.closest('.opt-top').length) return;

        var $subtitle = $('<div class="subtitle">Dialogues</div>');
        $dlg.before($subtitle);

        $subtitle.add($dlg).wrapAll('<div class="opt-top dialo1"></div>');
      });

      // Wrap all opt-top in infogen-top (within this annuaire)
      $annuaire.find('.dispo1, .reser1, .dialo1').wrapAll('<div class="infogen-top"></div>');

      // Sous-titres
      $annuaire.find('div.en-cours').each(function () {
        if ($(this).prev('.tt2').length) return;
        $('<div class="tt2">En cours</div>').insertBefore(this);
      });

      $annuaire.find('div.termine').each(function () {
        if ($(this).prev('.tt2').length) return;
        $('<div class="tt2">Terminés</div>').insertBefore(this);
      });

      $annuaire.find('div.tag-futur').each(function () {
        if ($(this).prev('.tt2').length) return;
        $('<div class="tt2">À venir</div>').insertBefore(this);
      });

      // lien-rp tag -> <a>
      $annuaire.find('lien-rp').replaceWith(function () {
        var url = $(this).text().trim();
        return $('<a>', { class: 'lien-rp', href: url, text: 'WWW' });
      });

      // Dots in rpdata
      $annuaire.find('.rpdata').each(function () {
        $(this)
          .find('div.date-rp, a.lien-rp, div.titre-rp')
          .each(function () {
            if (!$(this).next().hasClass('dotdudemon')) {
              $('<div class="dotdudemon">•</div>').insertAfter(this);
            }
          });
      });

      // Dots between mentiontags in tag-futur
      $annuaire.find('div.tag-futur').each(function () {
        var $mentions = $(this).find('a.mentiontag');
        if ($mentions.length <= 1) return;

        $mentions.not(':last').each(function () {
          if (!$(this).next().hasClass('dotdudemon')) {
            $('<div class="dotdudemon">•</div>').insertAfter(this);
          }
        });
      });

      // Wrap all annuaire blocks into .blocrp (within this annuaire)
      $annuaire.find('.tt2, .tag-futur, .termine, .en-cours').wrapAll('<div class="blocrp"></div>');
    });

    /* =========================================================
       RÉPERTOIRE
       ========================================================= */
    $carnet.find('div.annuaire').each(function () {
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;
      $('<div class="subtitle bar">Répertoire des relations</div>').insertAfter(this);
    });

    $carnet.find('div.repertoire').each(function () {
      var $repertoire = $(this);

      $repertoire.find('div.perso').each(function () {
        var $perso = $(this);

        // Wrap .rep + .mentiontag -> .repWrap (guard against doubles)
        var $repGroup = $perso.find('.rep, .mentiontag');
        if ($repGroup.length && !$repGroup.first().parent().hasClass('repWrap')) {
          $repGroup.wrapAll('<div class="repWrap"></div>');
        }

        // Wrap .repWrap + .descrep -> .pbb > .perso-bubble > .inforep (guard against doubles)
        var $infoGroup = $perso.find('.repWrap, .descrep');
        if ($infoGroup.length && !$infoGroup.first().closest('.pbb').length) {
          $infoGroup.wrapAll('<div class="pbb"><div class="perso-bubble"><div class="inforep"></div></div></div>');
        }

        // Wrap images (guard against doubles)
        $perso.find('img').each(function () {
          if (!$(this).parent().hasClass('blocimg')) {
            $(this).wrap('<div class="blocimg"></div>');
          }
        });
      });
    });

    /* =========================================================
       RECHERCHE & PRÉLIENS
       ========================================================= */
    $carnet.find('.repertoire').each(function () {
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;
      $('<div class="subtitle bar">Recherches de liens & RPS</div>').insertAfter(this);
    });

    $carnet.find('div.liensrech').each(function () {
      var $liens = $(this);

      // Demander un lien
      $liens.find('div.requete').each(function () {
        var $requete = $(this);
        if ($requete.closest('.opt-top').length) return;

        var $subtitle = $('<div class="subtitle">Demander un lien</div>');
        $requete.before($subtitle);

        $subtitle.add($requete).wrapAll('<div class="opt-top req1"></div>');
      });

      // Prédéfini attendu
      $liens.find('div.predef').each(function () {
        var $predef = $(this);
        if ($predef.closest('.opt-top').length) return;

        var $subtitle = $('<div class="subtitle">Prédéfini Attendu</div>');
        $predef.before($subtitle);

        $subtitle.add($predef).wrapAll('<div class="opt-top pred1"></div>');
      });

      // Prélien attendu
      $liens.find('div.prel').each(function () {
        var $prelien = $(this);
        if ($prelien.closest('.opt-top').length) return;

        var $subtitle = $('<div class="subtitle">Prélien Attendu</div>');
        $prelien.before($subtitle);

        $subtitle.add($prelien).wrapAll('<div class="opt-top prel1"></div>');
      });

      // Wrap opt-top blocks for this liensrech only
      $liens.find('.req1, .pred1, .prel1').wrapAll('<div class="infogen-top"></div>');

      // Wrap all lienq blocks for this liensrech only
      $liens.find('.lienq').wrapAll('<div class="lien-quel"></div>');
    });

  }); // end each carnet
});
