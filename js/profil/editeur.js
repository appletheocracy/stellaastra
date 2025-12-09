$(function () {

  // Map page title → class + dl prefix
  const MAP = [
    { text: "Enregistrement",                panelClass: "mod-save",        prefix: "save"   },
    { text: "Profil personnalisé",           panelClass: "mod-profil-perso", prefix: "pperso" },
    { text: "Préférences",                   panelClass: "mod-pref",         prefix: "pref"   },
    { text: "Panneau de contrôle des Avatars", panelClass: "mod-ctrl-ava",   prefix: "ava"    }
  ];

  $('h1.page-title').each(function () {
    const $h1 = $(this);
    const title = $.trim($h1.text());
    const cfg = MAP.find(m => title.indexOf(m.text) !== -1);
    if (!cfg) return;

    // 1) Add the class to the panel right after h1
    const $panel = $h1.next('.panel');
    if (!$panel.length) return;
    $panel.addClass(cfg.panelClass);

    // 2) Number all <dl> inside this panel
    $panel.find('fieldset dl').each(function (i) {
      $(this).addClass(cfg.prefix + i);
    });
  });

});
