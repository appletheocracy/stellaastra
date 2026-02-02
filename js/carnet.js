$(function () {
  $('carnet-humain').replaceWith(function () {
      return $('<div>', {
        class: 'carnet humain',
        html: $(this).html()
      });
  });
  $('carnet-vampire').replaceWith(function () {
      return $('<div>', {
        class: 'carnet vampire',
        html: $(this).html()
      });
  });
  $('carnet-hybride').replaceWith(function () {
      return $('<div>', {
        class: 'carnet hybride',
        html: $(this).html()
      });
  });
  $('carnet-chimere').replaceWith(function () {
      return $('<div>', {
        class: 'carnet chimere',
        html: $(this).html()
      });
  });
  $('carnet-eveille').replaceWith(function () {
      return $('<div>', {
        class: 'carnet eveille',
        html: $(this).html()
      });
  });
  $('carnet').replaceWith(function () {
      return $('<div>', {
        class: 'carnet',
        html: $(this).html()
      });
  });

  $('div.carnet').each(function () {


    $(['cw','rep', 'daterp', 'linkrp', 'titrerp', 'annuaire', 'date-rp', 'titre-rp', 'en-cours', "termine", "repertoire"]).each(function (_, tag) {
      $(tag).each(function () {
        var $el = $(this);

        $('<div>', {
          class: tag,
          html: $el.html()
        }).replaceAll($el);
      });
    });

    $('nom-compte').replaceWith(function () {
      return $('<div>', {
        class: 'subtitle',
        html: $(this).html()
      });
    });
    $('joueur').replaceWith(function () {
      return $('<div>', {
        class: 'featuser',
        html: $(this).html()
      });
    });
    $('content-warnings').replaceWith(function () {
      return $('<div>', {
        class: 'carnet-cw',
        html: $(this).html()
      });
    });

    $('dispo').replaceWith(function () {
      return $('<div>', {
        class: 'info disponi',
        html: $(this).html()
      });
    });

    $('entete').replaceWith(function () {
      return $('<div>', {
        class: 'entete',
        html: $(this).html()
      });
    });
    $('reservations').replaceWith(function () {
      return $('<div>', {
        class: 'info resa',
        html: $(this).html()
      });
    });

    $('dialogues').replaceWith(function () {
      return $('<div>', {
        class: 'info dialogues',
        html: $(this).html()
      });
    });
    $('rp').replaceWith(function () {
      return $('<div>', {
        class: 'rpdata',
        html: $(this).html()
      });
    });
    $('a-venir').replaceWith(function () {
      return $('<div>', {
        class: 'rpdata tag-futur',
        html: $(this).html()
      });
    });

    $('nom-lien').replaceWith(function () {
      return $('<div>', {
        class: 'rep',
        html: $(this).html()
      });
    });

    $('lien').replaceWith(function () {
      return $('<div>', {
        class: 'perso',
        html: $(this).html()
      });
    });
    $('description').replaceWith(function () {
      return $('<div>', {
        class: 'descrep',
        html: $(this).html()
      });
    });
    $('description').replaceWith(function () {
      return $('<div>', {
        class: 'descrep',
        html: $(this).html()
      });
    });

    $('liens-predefs').replaceWith(function () {
      return $('<div>', {
        class: 'liensrech',
        html: $(this).html()
      });
    });

    $('preference-com').replaceWith(function () {
      return $('<div>', {
        class: 'info requete',
        html: $(this).html()
      });
    });

    $('predefini-attendu').replaceWith(function () {
      return $('<div>', {
        class: 'info predef',
        html: $(this).html()
      });
    });

    $('prelien-attendu').replaceWith(function () {
      return $('<div>', {
        class: 'info prel',
        html: $(this).html()
      });
    });

    $('type-lien').replaceWith(function () {
      return $('<div>', {
        class: 'nm',
        html: $(this).html()
      });
    });

    $('description-lien').replaceWith(function () {
      return $('<div>', {
        class: 'descnm',
        html: $(this).html()
      });
    });
    $('prelien').replaceWith(function () {
      return $('<div>', {
        class: 'lienq',
        html: $(this).html()
      });
    });

    $('.entete, .subtitle.bar, .annuaire, .repertoire, .liensrech')
    .wrapAll('<div class="contenu"></div>');

    $('div.contenu').each(function () {
      // avoid duplicates
      if ($(this).prev('.title').length) return;

      $('<div class="title">Carnet de route</div>').insertBefore(this);
    });    

    //ENTÊTE -----------------------------------------------------------------
    //Wrapper .info_entete
    $('div.entete').each(function () {
      var $entete = $(this);


      //Content Warnings/Intro
      $('div.featuser').each(function () {
        var $feat = $(this);

        // avoid double wrapping
        if ($feat.parent().hasClass('carnet-cw')) return;

        // If there is already <st3>Joué par:</st3> right before, include it in the wrap
        var $st3 = $feat.prev('st3');
        if ($st3.length && $st3.text().trim() === 'Joué par:') {
          $st3.add($feat).wrapAll('<div class="carnet-cw"></div>');
          return;
        }

        // Otherwise, create the title and wrap both
        $('<st3>Joué par:</st3>').insertBefore($feat);
        $feat.prev('st3').add($feat).wrapAll('<div class="carnet-cw"></div>');
      });

      $('div.carnet-cw').each(function () {
        var $wrap = $(this);
        var $cw = $wrap.find('div.cw');    

        /* -------- CW -------- */
        if ($cw.length) {
          if (!$wrap.children('st3').filter(function () {
            return $(this).text().trim() === 'CW Joués:';
          }).length) {
            $('<st3>CW Joués:</st3>').insertBefore($cw.first());
          }
        }
      });

      $entete.children('div.subtitle').each(function () {
        var $subtitle = $(this);

        // collect subtitle + following carnet-cw blocks
        var $group = $subtitle.nextUntil('div.subtitle', 'div.carnet-cw').addBack();

        // avoid double wrapping
        if ($subtitle.parent().hasClass('info_entete')) return;

        $group.wrapAll('<div class="info_entete"></div>');
      });

      $('img').each(function () {
        // Prevent double wrapping
        if (!$(this).parent().hasClass('ttimg')) {
          $(this).wrap('<div class="ttimg"></div>');
        }

      });
    });  

    //ANNUAIRE - INFOGEN-TOP -----------------------------------------------------------------
    //Titre Annuaire
    $('div.entete').each(function () {
      // avoid duplicates
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;

      $('<div class="subtitle bar">Annuaire des roles plays</div>')
        .insertAfter(this);
    });
    
    $('div.annuaire').each(function () {
      var $annuaire = $(this);

      //Dispos
      $('div.disponi').each(function () {
        var $dispo = $(this);
        // avoid double processing
        if ($dispo.closest('.opt-top').length) return;

        // create infodata
        var $info = $('<div class="infodata">Disponibilités</div>');
        $dispo.after($info);

        // wrap dispo + infodata
        $dispo.add($info).wrapAll('<div class="info dispo dispowrap"></div>');
        var $infoDispo = $dispo.parent();

        // insert subtitle before info.dispo
        var $subtitle = $('<div class="subtitle">Disponibilités</div>');
        $infoDispo.before($subtitle);

        // wrap subtitle + info.dispo
        $subtitle.add($infoDispo).wrapAll('<div class="opt-top dispo1"></div>');
      });

      //Réservations
      $('div.resa').each(function () {
        var $resa = $(this);

        // avoid double wrapping
        if ($resa.closest('.opt-top').length) return;

        // insert subtitle before resa
        var $subtitle = $('<div class="subtitle">Réservations</div>');
        $resa.before($subtitle);

        // wrap subtitle + resa
        $subtitle.add($resa).wrapAll('<div class="opt-top reser1"></div>');
      });

      //Dialogues
      $('div.dialogues').each(function () {
        var $dlg = $(this);

        // avoid double wrapping
        if ($dlg.closest('.opt-top').length) return;

        // insert subtitle before dialogues
        var $subtitle = $('<div class="subtitle">Dialogues</div>');
        $dlg.before($subtitle);

        // wrap subtitle + dialogues
        $subtitle.add($dlg).wrapAll('<div class="opt-top dialo1"></div>');
      });

      //Englobe dans div.infogen-top
      $('.dispo1, .reser1, .dialo1').wrapAll('<div class="infogen-top"></div>');

      //Soustitre en cours
      $('div.en-cours').each(function () {
        // avoid duplicates
        if ($(this).prev('.tt2').length) return;

        $('<div class="tt2">En cours</div>').insertBefore(this);
      });

      //Soustitre terminé
      $('div.termine').each(function () {
        // avoid duplicates
        if ($(this).prev('.tt2').length) return;

        $('<div class="tt2">Terminés</div>').insertBefore(this);
      });
      //Soustitre à venir
      $('div.tag-futur').each(function () {
        // avoid duplicates
        if ($(this).prev('.tt2').length) return;

        $('<div class="tt2">À venir</div>').insertBefore(this);
      });

      //Génère le lien du RP
      $('lien-rp').replaceWith(function () {
        var url = $(this).text().trim();

        return $('<a>', {
          class: 'lien-rp',
          href: url,
          text: 'WWW'
        });
      });

      //Ajoute le point entre chaque info sauf la dernière
      $('.rpdata').each(function () {
        $(this)
          .find('div.date-rp, a.lien-rp, div.titre-rp')
          .each(function () {

            // éviter les doublons si le script est relancé
            if (!$(this).next().hasClass('dotdudemon')) {
              $('<div class="dotdudemon">•</div>').insertAfter(this);
            }

          });
      });
      $('div.tag-futur').each(function () {

        var $mentions = $(this).find('a.mentiontag');

        // 0 ou 1 mention → on ne fait rien
        if ($mentions.length <= 1) return;

        // Ajouter le séparateur après chaque mention sauf la dernière
        $mentions.not(':last').each(function () {

          if (!$(this).next().hasClass('dotdudemon')) {
            $('<div class="dotdudemon">•</div>').insertAfter(this);
          }

        });
      });

      //Enveloppe les infos dans .blocrp
        $(this).find('.tt2, .tag-futur, .termine, .en-cours').wrapAll('<div class="blocrp"></div>');  
    });

    //RÉPERTOIRE -----------------------------------------------------------------
    //Titre répertoire
    $('div.annuaire').each(function () {
      // avoid duplicates
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;

      $('<div class="subtitle bar">Répertoire des relations</div>')
        .insertAfter(this);
    });

    //Editeur
    $('div.repertoire').each(function () {    

        $('div.perso').each(function () {
        var $perso = $(this);
        // Wrap rep + .mentiontag
        $perso.find('.rep, .mentiontag').wrapAll('<div class="repWrap"></div>');

        // Wrap repWrap + descrep
        $perso.find('.repWrap, .descrep').wrapAll('<div class="pbb"><div class="perso-bubble"><div class="inforep"></div></div></div>');

        $perso.find('img').wrap('<div class="blocimg"></div>');
      });
    });

    //RECHERCHE & PRÉLIENS -----------------------------------------------------------------
    //Titre répertoire
    $('.repertoire').each(function () {
      // avoid duplicates
      if ($(this).next().hasClass('subtitle') && $(this).next().hasClass('bar')) return;

      $('<div class="subtitle bar">Recherches de liens & RPS</div>')
        .insertAfter(this);
    });

    //Editeur
    $('div.liensrech').each(function () {

      //Communications
      $('div.requete').each(function () {
        var $requete = $(this);

        // avoid double wrapping
        if ($requete.closest('.opt-top').length) return;

        // insert subtitle before requete
        var $subtitle = $('<div class="subtitle">Demander un lien</div>');
        $requete.before($subtitle);

        // wrap subtitle + requete
        $subtitle.add($requete).wrapAll('<div class="opt-top req1"></div>');
      });

      //Réservations
      $('div.predef').each(function () {
        var $predef = $(this);

        // avoid double wrapping
        if ($predef.closest('.opt-top').length) return;

        // insert subtitle before predef
        var $subtitle = $('<div class="subtitle">Prédéfini Attendu</div>');
        $predef.before($subtitle);

        // wrap subtitle + predef
        $subtitle.add($predef).wrapAll('<div class="opt-top pred1"></div>');
      });

      //Prélien Attendu
      $('div.prel').each(function () {
        var $prelien = $(this);

        // avoid double wrapping
        if ($prelien.closest('.opt-top').length) return;

        // insert subtitle before Préliens attendu
        var $subtitle = $('<div class="subtitle">Prélien Attendu</div>');
        $prelien.before($subtitle);

        // wrap subtitle + attendu
        $subtitle.add($prelien).wrapAll('<div class="opt-top prel1"></div>');
      });

      //Englobe dans div.infogen-top
      $('.req1, .pred1, .prel1').wrapAll('<div class="infogen-top"></div>');

      $('.lienq').wrapAll('<div class="lien-quel"></div>'); 
    });
  });
});
