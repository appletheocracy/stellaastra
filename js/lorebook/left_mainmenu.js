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

    <div class="titre-menu">Introduction</div>

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
      <ion-icon name="newspaper-outline"></ion-icon>
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
    
    <div class="titre-menu2">Guides</div>

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

    <div class="titre-menu2">Contexte Général</div>
    <a href="/h12-chronologie" class="mainmenu">
      <div class="ligne-menu">
        <div class="ligne"></div>
      </div>
      <ion-icon name="calendar-outline"></ion-icon>
      <span>Chronologie</span>
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

    <div class="titre-menu2">CONTEXTE DE LA FEPS</div>
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
      <ion-icon name="earth-outline"></ion-icon>
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
});
