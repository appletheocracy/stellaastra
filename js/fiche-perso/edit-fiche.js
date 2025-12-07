$(function () { 
  var FORM_BASE = '/h1-fiche-edition-formulaire-de-presentation';

  /* ---------- helpers ---------- */
  function textOf($el){ return $el.length ? ($el.text() || '').trim() : ''; }
  function srcOf($el){ return $el.length ? ($el.attr('src') || '').trim() : ''; }
  function onlyDigits($el){ var s=textOf($el), m=s.match(/\d+/); return m? m[0] : ''; }
  // Preserve indentation/newlines for textarea-like blocks
  function preserveText($el){
    if (!$el.length) return '';
    var html = ($el.html() || '')
      .replace(/\r\n/g, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, '\n');
    var out = $('<div>').html(html).text().replace(/\u00A0/g,' ');
    return out;
  }

  /* ---------- ensure ONLY .btn-edit gets redirected (and keep original for .btn-admin) ---------- */
  function syncAdminHref($scope){
    $($scope).find('.post').each(function(){
      var $post = $(this);
      var $edit = $post.find('.profile-icons.bouton_modif a.btn-edit').first();
      if (!$edit.length) return;

      // If we stashed the original href, use it for ADMIN
      var orig = $edit.attr('data-orig-href');
      if (orig) {
        $post.find('.profile-icons.bouton_modif a.btn-admin').attr('href', orig);
      }
    });
  }

  function wireEditLinks(ctx) {
    $(ctx).find('.post').each(function () {
      var $post = $(this);
      var postId = this.id || '';
      if (!/^p\d+$/.test(postId)) return;

      // only target posts that have a fiche_wrapper
      if (!$post.find('.postbody .content .fiche_wrapper').length) return;

      var $edit = $post.find('.profile-icons.bouton_modif a.btn-edit').first();
      if (!$edit.length) return;

      // Stash the original EDIT_URL once, BEFORE overwriting .btn-edit
      if (!$edit.attr('data-orig-href')) {
        $edit.attr('data-orig-href', $edit.attr('href') || '#');
      }

      // Redirect ONLY the .btn-edit
      $edit.attr('href', FORM_BASE + '?pid=' + encodeURIComponent(postId));

      // If an ADMIN button exists, force it to the original (non-redirect) URL
      var $admin = $post.find('.profile-icons.bouton_modif a.btn-admin').first();
      if ($admin.length) {
        $admin.attr('href', $edit.attr('data-orig-href'));
      }
    });
  }

  /* ---------- on ÉDITER click: snapshot data ---------- */
  $(document).on('click', '.profile-icons.bouton_modif a.btn-edit', function () {
    var $post = $(this).closest('.post');
    var postId = $post.attr('id') || '';
    if (!/^p\d+$/.test(postId)) return;

    // store last pid for fallback on the form page
    try { sessionStorage.setItem('ficheEdit:lastPid', postId); } catch(e){}

    var $wrapper = $post.find('.fiche_wrapper').first();
    if (!$wrapper.length) return;

    // Title = closest .sujTitleTxt before this post (fallback: first on page)
    var $title = $post.prevAll('.sujTitleTxt').first();
    if (!$title.length) $title = $('.sujTitleTxt').first();

    // Group label + code
    var groupLabel = textOf($wrapper.find('.titre_groupe').first());
    var groupCode = '';
    ($wrapper.attr('class') || '').split(/\s+/).some(function(c){
      var m = c.match(/^fiche_(?!wrapper$)([a-z0-9_-]+)$/i);
      if (m){ groupCode = (m[1]||'').toLowerCase(); return true; }
      return false;
    });

    // Header/name/artists/images
    var fullName  = textOf($wrapper.find('.fiche_prenom_nom').first()) || textOf($wrapper.find('.fiche_prenom_nom1').first());
    var imgHeader = srcOf($wrapper.find('.fond_entete img').first()) || srcOf($wrapper.find('.fiche_img_entete_overflow img').first());
    var fchar     = textOf($wrapper.find('.f-char').first()).replace(/^\s*FEAT\.?\s*/i,'').replace(/\s*-\s*$/,'');
    var fauthor   = textOf($wrapper.find('.f-author').first());

    var fields = {
      // top
      titrefiche: textOf($title),
      nomprenom: fullName,
      imgentete: imgHeader,
      artfeat: fchar,
      featartiste: fauthor,

      // entete_info blocks
      id_genre: textOf($wrapper.find('.id_genre .bloc_rep_fiche').first()),
      pronoms: textOf($wrapper.find('.pronoms .bloc_rep_fiche').first()),
      orientation: textOf($wrapper.find('.orientation .bloc_rep_fiche').first()),
      lieu_de_naissance: textOf($wrapper.find('.lieu_naissance .bloc_rep_fiche').first()),
      date_de_naissance: textOf($wrapper.find('.f_ddn .bloc_rep_fiche').first()),
      age: onlyDigits($wrapper.find('.age_perso .bloc_rep_fiche').first()),
      emploi: textOf($wrapper.find('.f_jobbing .bloc_rep_fiche').first()),

      // faits & gestes
      groupe_sanguin: textOf($wrapper.find('.groupe_sanguin .bloc_rep_fiche').first()),
      taille: textOf($wrapper.find('.ftaille .bloc_rep_fiche').first()),
      hybridation: textOf($wrapper.find('.hybridation .bloc_rep_fiche').first()),
      age_apparent: onlyDigits($wrapper.find('.age_transfo .bloc_rep_fiche').first()),
      poids: textOf($wrapper.find('.poids .bloc_rep_fiche').first()),
      image_faits: srcOf($wrapper.find('.faits_img img').first()),

      // textareas — preserve indentation/newlines
      desc_mentale:   preserveText($wrapper.find('.psychee_texte').first()),
      id_politique:   preserveText($wrapper.find('.f-pol_reponse').first()),
      img_id_politique: srcOf($wrapper.find('.f-pol_img img').first()),
      texte_histoire: preserveText($wrapper.find('.histoire_texte').first()),
      texte_mot:      preserveText($wrapper.find('.mot_doux .bloc_rep_fiche').first()),

      // IRL area
      pseudo: textOf($wrapper.find('.rep1').first()),
      irl_pronoms: textOf($wrapper.find('.rep2').first()),
      rp_hide: textOf($wrapper.find('.rep3').first()),
      img_irl: srcOf($wrapper.find('.f-irl-avatar img').first())
    };

    // Arrays: facts
    fields.facts = [];
    $wrapper.find('.fiche_facts .bloc_rep_fiche .f-facts, .f-facts').each(function(){
      var s = preserveText($(this)).replace(/\s*\n\s*/g,' ').trim();
      if (s) fields.facts.push(s);
    });

    // Arrays: signes
    fields.signes = [];
    $wrapper.find('.fiche_signes .bloc_rep_fiche .f-signe, .f-signe').each(function(){
      var s = preserveText($(this)).replace(/\s*\n\s*/g,' ').trim();
      if (s) fields.signes.push(s);
    });

    // Qualités & Défauts
    (function () {
      var list = [];
      $wrapper.find('.qualites_defauts .qd_reply, .qd_reply').each(function(){
        var $el = $(this), idx = -1;
        var cls = ($el.attr('class') || '').split(/\s+/);
        for (var k = 0; k < cls.length; k++) {
          var m = cls[k].match(/^qd(\d+)$/i);
          if (m) { idx = +m[1]; break; }
        }
        var val = ($el.text() || '').replace(/\r\n/g,'\n').replace(/\n+/g,' ').trim();
        if (!val) return;
        if (idx >= 0) list[idx] = val; else list.push(val);
      });
      fields.quali_defs = list.filter(function(v){return v!=null && v!=='';}).slice(0,10);
    })();

    // Timeline
    (function () {
      fields.timeline = [];         // [{annee, mois, desc}, ...]
      fields.timelineFinal = null;  // {annee, mois, desc}

      var $lastMarked = $wrapper.find('.last-timeline-block').first();
      if ($lastMarked.length) {
        fields.timelineFinal = {
          annee: textOf($lastMarked.find('.fiche_f-annee').first()),
          mois:  textOf($lastMarked.find('.fiche_f-mois').first()),
          desc:  preserveText($lastMarked.find('.fiche_f-desc').first())
        };
      }

      $wrapper.find('.f-anne-mois').each(function () {
        var $am = $(this);
        if ($am.closest('.last-timeline-block').length) return; // skip final-marked
        var annee = textOf($am.find('.fiche_f-annee').first());
        var mois  = textOf($am.find('.fiche_f-mois').first());
        var desc  = preserveText($am.nextAll('.fiche_f-desc').first());
        if (annee || mois || desc) fields.timeline.push({ annee: annee, mois: mois, desc: desc });
      });

      if (!fields.timelineFinal && fields.timeline.length) {
        fields.timelineFinal = fields.timeline[fields.timeline.length - 1];
        fields.timeline = fields.timeline.slice(0, -1);
      }

      // Correction: final textarea = LAST .f-timeline .fiche_f-desc
      var lastDescInTimeline = preserveText($wrapper.find('.f-timeline .fiche_f-desc').last());
      if (lastDescInTimeline) {
        if (!fields.timelineFinal) fields.timelineFinal = { annee:'', mois:'', desc:'' };
        fields.timelineFinal.desc = lastDescInTimeline;
      }
    })();

    var payload = {
      pid: postId,
      title: fields.titrefiche,
      groupLabel: groupLabel,
      groupCode: groupCode,
      fields: fields
    };

    try { sessionStorage.setItem('ficheEdit:' + postId, JSON.stringify(payload)); } catch (e) {}
  });

  /* ---------- init + observe ---------- */
  wireEditLinks(document);
  syncAdminHref(document);

  var wrap = document.getElementById('wrap');
  if (wrap && window.MutationObserver) {
    new MutationObserver(function (m) {
      for (var i = 0; i < m.length; i++) {
        if (m[i].addedNodes && m[i].addedNodes.length) { 
          wireEditLinks(wrap);
          syncAdminHref(wrap);
          break;
        }
      }
    }).observe(wrap, { childList: true, subtree: true });
  }
});
