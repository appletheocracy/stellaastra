$(function () {
  var $menuContainer = $('.mainmenu_lorebook');
  if (!$menuContainer.length) return;

  var menuHtml = `
    <div class="bouton_retour">
    <a href="/" class="retour">
    <ion-icon name="arrow-back-outline"></ion-icon>
    <div>&nbsp;&nbsp;retour sur&nbsp;<span class="f-name">Stella Cinis</span></div>
    </a>                        
</div>
<div class="mainmenu_pliables intro">
    <div class="titre-menu"><span>Introduction</span><ion-icon class="chevron-down" name="chevron-down-outline"></ion-icon><ion-icon class="chevron-up" name="chevron-up-outline"></ion-icon></div>
    <a href="/h3-intro" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="bonfire-outline"></ion-icon>
        <span>Prémices</span>
    </a>
    <a href="/h11-contexte" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="library-outline"></ion-icon>
        <span>Contexte</span>
    </a>
    <a href="/h4-rules" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="shield-half-outline"></ion-icon>
        <span>Règlement</span>
    </a>
    <a href="/h5-staff" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="rocket-outline"></ion-icon>
        <span>Staff</span>
    </a>
    <a href="/h6-credits" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="diamond-outline"></ion-icon>
        <span>Remerciements&nbsp;&amp;&nbsp;crédits</span>
    </a>
</div>
<div class="mainmenu_pliables guides">
    <div class="titre-menu2"><span>Guides</span><ion-icon class="chevron-down" name="chevron-down-outline"></ion-icon><ion-icon class="chevron-up" name="chevron-up-outline"></ion-icon></div>
    <a href="/h7-en-arrivant" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="ticket-outline"></ion-icon>
        <span>En arrivant</span>
    </a>
    <a href="/h8-creation-de-personnages" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="person-add-outline"></ion-icon>
        <span>Création de personnage</span>
    </a>
    <a href="/h9-bottins-divers" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="list-outline"></ion-icon>
        <span>Bottins divers</span>
    </a>
    <a href="/h10-mises-en-page" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="code-working-outline"></ion-icon>
        <span>Mises en pages</span>
    </a>
</div>
<div class="mainmenu_pliables general">
    <div class="titre-menu2"><span>Contexte Général</span><ion-icon class="chevron-down" name="chevron-down-outline"></ion-icon><ion-icon class="chevron-up" name="chevron-up-outline"></ion-icon></div>
    <a href="/h12-chronologie" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="calendar-outline"></ion-icon>
        <span>Chronologie</span>
    </a>
        <a href="/h26-virus-vampire" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="logo-vue"></ion-icon>
        <span>Virus Vampire</span>
    </a>
    <a href="/h20-necrosis" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="thermometer-outline"></ion-icon>
        <span>Virus Necrosis</span>
    </a>
    <a href="/h14-immortels" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="infinite-outline"></ion-icon>
        <span>Immortels·les</span>
    </a>
    <a href="/h16-mortels" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="hourglass-outline"></ion-icon>
        <span>Mortels·les</span>
    </a>
    <a href="/h19-contexte-international" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="boat-outline"></ion-icon>
        <span>Contexte International</span>
    </a>
</div>  
<div class="mainmenu_pliables feps">
    <div class="titre-menu2"><span>CONTEXTE DE LA FEPS</span><ion-icon class="chevron-down" name="chevron-down-outline"></ion-icon><ion-icon class="chevron-up" name="chevron-up-outline"></ion-icon></div>
    <a href="/h18-copenhague" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="home-outline"></ion-icon>
        <span>Copenhague - Danemark</span>
    </a>                    
    <a href="/h17-feps" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="flag-outline"></ion-icon>
        <span>La FEPS</span>
    </a>                            
    <a href="/h21-forces-armees" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="warning-outline"></ion-icon>
        <span>Forces Armées Fédérales</span>
    </a>
    <a href="/h22-politiques-demo" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="receipt-outline"></ion-icon>
        <span>Politiques Démographiques</span>
    </a>
    <a href="/h13-culture-et-societe" class="mainmenu">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="wifi-outline"></ion-icon>
        <span>Culture&nbsp;&amp;&nbsp;Société</span>
    </a>
    <a href="/h23-science-et-urbanisme" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="flask-outline"></ion-icon>
        <span>Science&nbsp;&amp;&nbsp;Urbanisme</span>
    </a>
    <a href="/h24-commerce-sang" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="pulse-outline"></ion-icon>
        <span>Commerce de sang</span>
    </a>
    <a href="/h25-underground-crime" class="mainmenu diff">
        <div class="ligne-menu">
        <div class="ligne"></div>
        </div>
        <ion-icon name="skull-outline"></ion-icon>
        <span>Underground&nbsp;&amp;&nbsp;Criminalité</span>
    </a>
</div>
  `;

  // Inject HTML into the container
  $menuContainer.html(menuHtml);

  // Add .select to the link matching the current /h# page
  var currentPath = window.location.pathname || '';

  $menuContainer.find('a.mainmenu').each(function () {
    var $link = $(this);
    var href = $link.attr('href');

    if (!href) return;

    // Match exact path (ex: /h3-intro == /h3-intro)
    if (currentPath === href) {
      $link.addClass('select');
    }
  });

  // ==========================================
  // FEPS-related pages:
  // If we are on one of these URLs, force the
  // FEPS menu link (/h17-feps) to be selected,
  // even if the navigation comes from outside
  // the .mainmenu (e.g. target="_blank" links).
  // ==========================================
  (function () {
    var fepsContextPages = [
      '/h18-feps',
      '/h19-copenhague',
      '/h20-contexte-international'
    ];

    if (fepsContextPages.indexOf(currentPath) === -1) {
      return;
    }

    var $fepsLink = $menuContainer.find('a.mainmenu[href="/h17-feps"]');

    if ($fepsLink.length) {
      // Clear previous selection and set FEPS as the only selected item
      $menuContainer.find('a.mainmenu.select').removeClass('select');
      $fepsLink.addClass('select');
    }
  })();

  // ============================================================
  // Menu unfolding logic for .mainmenu_pliables
  // 1) If a.mainmenu.select exists inside, add .menu_unfolded to parent
  // 2) That .menu_unfolded can never be removed for that parent
  // 3) Clicking titles of sections WITHOUT .select:
  //    - toggles .menu_unfolded on that section
  //    - when opening, removes .menu_unfolded from other sections
  //      that also don't contain .select
  // ============================================================

  var $sections = $menuContainer.find('.mainmenu_pliables');

  // Initial state: mark sections that contain a .select
  $sections.each(function () {
    var $section = $(this);
    var hasSelected = $section.find('a.mainmenu.select').length > 0;

    if (hasSelected) {
      // Always unfolded and "locked" by the selected link
      $section.addClass('menu_unfolded menu_has_select');
    } else {
      // Others start folded (CSS will handle visibility)
      $section.removeClass('menu_unfolded menu_has_select');
    }
  });

  // Click handler on titles (only sections WITHOUT .select are toggleable)
  $menuContainer.on('click', '.titre-menu, .titre-menu2', function (e) {
    e.preventDefault();

    var $title   = $(this);
    var $section = $title.closest('.mainmenu_pliables');

    // If this section contains a selected link, it is locked open
    if ($section.find('a.mainmenu.select').length > 0) {
      return;
    }

    var isOpen = $section.hasClass('menu_unfolded');

    if (isOpen) {
      // Toggle OFF: just close this one
      $section.removeClass('menu_unfolded');
    } else {
      // Toggle ON: open this one
      $section.addClass('menu_unfolded');

      // And close all other sections that do NOT contain .select
      $sections.each(function () {
        var $other = $(this);
        if ($other[0] === $section[0]) return;

        // Skip sections that contain a .select (locked open)
        if ($other.find('a.mainmenu.select').length > 0) return;

        $other.removeClass('menu_unfolded');
      });
    }
  });
  

});
