/* === Lorebook builders with caching (Avatars #b-ava, Jobs #b-job) ============
 * Builds two dynamic sections from user profiles:
 *   - #b-ava: avatars list (feat + artist + username)
 *   - #b-job: jobs list (job + username)
 *
 * Plus: imports static lists from forum topics into:
 *   - #b-reservation → .avatars-reserves-list
 *   - #b-noms-prenoms → .nomslisting / .prenomslisting
 * ============================================================================ */

(function ($) {
  $(function () {
    /* ===================== CONFIG ===================== */
    const EXCLUDE = new Set([1, 2, 3]);
    const MAX_U = 500;
    const START_ID = 1;
    const CONCURRENCY = 4;
    const STOP_AFTER_MISSES = 50;

    // Cache settings
    const CACHE_KEY = 'lorebook_cache_v1_data';
    const CACHE_AT  = 'lorebook_cache_v1_time';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
    const COOKIE_NAME = 'lorebook_cache_v1';
    const COOKIE_MAX_AGE = 24 * 60 * 60; // 24h, seconds

    /* ===================== UTILS ===================== */
    const norm = (s) => (s || '').toString().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const firstLetter = (s) => {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : '#';
    };

    const stripStrongKeepContent = ($el) => {
      $el.find('strong').each(function () { $(this).replaceWith($(this).contents()); });
      return $el;
    };

    const spanHTMLtoText = (html) => $('<div>').html(html || '').text().trim();

    // Tiny cookie helpers (flag only — actual data lives in localStorage)
    function setFlagCookie() {
      document.cookie = `${COOKIE_NAME}=1; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    }
    function clearFlagCookie() {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    }

    // Cache helpers
    function saveCache(results) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(results));
        localStorage.setItem(CACHE_AT, String(Date.now()));
        setFlagCookie();
      } catch (e) {
        try {
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_AT);
        } catch(_) {}
        clearFlagCookie();
      }
    }

    function loadCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        const at  = Number(localStorage.getItem(CACHE_AT) || '0');
        if (!raw || !at) return null;
        if (Date.now() - at > CACHE_TTL_MS) return null; // stale
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return null;
        return data;
      } catch (_) { return null; }
    }

    function hasRefreshParam() {
      return /(?:\?|&)refresh=1(?:&|$)/.test(location.search);
    }

    /* ===================== PARSER ===================== */
    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));
      const $cp  = $dom.find('#cp-main');
      if (!$cp.length) return null;

      const $h1Span = $cp.find('.page-title span').first().clone();
      if (!$h1Span.length) return null;
      stripStrongKeepContent($h1Span);

      const featOg   = $cp.find('#field_id31  .field_uneditable').first().text().trim();
      const artistOg = $cp.find('#field_id1   .field_uneditable').first().text().trim();
      const artistLink = $cp.find('#field_id11 .field_uneditable').first().text().trim();
      const jobOg    = $cp.find('#field_id27 .field_uneditable').first().text().trim();

      if (!featOg && !artistOg && !jobOg) return null;

      const userSpanHTML = $('<div>').append($h1Span).html();

      return {
        featOg,
        artistOg,
        jobOg,
        userSpanHTML
      };
    }

    /* ===================== RENDERERS ===================== */
    function makeAvatarCard(e) {
      const $c = $('<div class="avatarlisting"></div>');
      $('<div class="feat-og"></div>').text(e.featOg).appendTo($c);
      $('<div class="feat-by">par</div>').appendTo($c);
      $('<div class="artist-og"></div>').text(e.artistOg).appendTo($c);
      $('<div class="feat-by">-</div>').appendTo($c);
      $('<div class="user-og"></div>').html(' ' + e.userSpanHTML).appendTo($c);

      // --- WRAP USER IN A LINK ---
      const $userLink = $('<a>')
          .attr('href', '/u' + e.uid)
          .html(e.userSpanHTML);
    
      $('<div class="user-og"></div>')
          .append($userLink)
          .appendTo($c);
          return $c[0];
      }

    function makeJobCard(e) {
      const $c = $('<div class="joblisting"></div>');
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);
      $('<div class="feat-by">-</div>').appendTo($c);
      $('<div class="user-og"></div>').html(' ' + e.userSpanHTML).appendTo($c);

      // --- WRAP USER IN A LINK ---
      const $userLink = $('<a>')
          .attr('href', '/u' + e.uid)
          .html(e.userSpanHTML);
    
      $('<div class="user-og"></div>')
          .append($userLink)
          .appendTo($c);
          
          return $c[0];
      }
    
    window.makeAvatarCard = makeAvatarCard;
    window.makeJobCard = makeJobCard;

    function buildGroupedSections(entries, groupKey, cardBuilder, kind) {
      const groups = new Map();
      entries.forEach(e => {
        const key = firstLetter(groupKey(e));
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
      });

      const letters = Array.from(groups.keys()).sort((a, b) => {
        if (a === '#') return 1;
        if (b === '#') return -1;
        return a.localeCompare(b);
      });

      const frag = document.createDocumentFragment();
      letters.forEach(L => {
        const $section = $('<div class="text_overall"></div>').attr('data-kind', kind);
        $section.append(`<div class="rule-mini-t">${L} <ion-icon name="arrow-redo-sharp"></ion-icon></div>`);
        groups.get(L).forEach(e => $section.append(cardBuilder(e)));
        frag.appendChild($section[0]);
      });
      return frag;
    }

    function insertAfterOverallEnt($rootBox, frag, kind) {
      const $content = $rootBox.find('.overall_content').first();
      if (!$content.length) return;
      $content.find(`.text_overall[data-kind="${kind}"]`).remove();
      const $ent = $content.find('.overall-ent').first();
      if ($ent.length) $ent.after(frag);
      else $content.prepend(frag);
    }

    function renderResults(results) {
      // derive sort keys once (feat, job)
      results.forEach(r => {
        r._featKey = norm(r.featOg || '');
        r._jobKey  = norm(r.jobOg  || '');
      });

      // AVATARS
      const $avaBox = $('#b-ava');
      if ($avaBox.length) {
        const avatarEntries = results
          .filter(r => r.featOg && r.artistOg)
          .sort((a, b) => a._featKey.localeCompare(b._featKey));
        const fragAva = buildGroupedSections(avatarEntries, e => e.featOg, makeAvatarCard, 'ava');
        insertAfterOverallEnt($avaBox, fragAva, 'ava');
      }

      // JOBS
      const $jobBox = $('#b-job');
      if ($jobBox.length) {
        const jobEntries = results
          .filter(r => r.jobOg)
          .sort((a, b) => a._jobKey.localeCompare(b._jobKey));
        const fragJob = buildGroupedSections(jobEntries, e => e.jobOg, makeJobCard, 'job');
        insertAfterOverallEnt($jobBox, fragJob, 'job');
      }
    }

    /* ===================== STATIC LIST IMPORTS ===================== */
    /**
     * Copies three lists from two topic pages into the current page:
     *  - #b-reservation  → .avatars-reserves-list  (from /t12-reservations-d-avatar)
     *  - #b-noms-prenoms → .nomslisting/.prenomslisting (from /t55-bottin-des-nom-prenoms#91)
     *
     * If a source block is empty, writes "Information à venir."
     */
    function loadReservationsAndNames() {
      const URL_RESERVATIONS = 'https://stella-cinis.forumactif.com/t12-reservations-d-avatar';
      const URL_NOMS_PRENOMS = 'https://stella-cinis.forumactif.com/t55-bottin-des-nom-prenoms';

      /* ---------- #b-reservation ---------- */
      $.ajax({
        url: URL_RESERVATIONS,
        dataType: 'html',
        timeout: 20000
      }).done(function (html) {
        const $dom = $('<div>').append($.parseHTML(html));

        const $box = $('#b-reservation');
        if (!$box.length) return;

        const $sink = $box.find('.avatars-reserves-list').first();
        if (!$sink.length) return;

        const $srcReservations = $dom.find('#les_reservations .reservationlisting');
        if ($srcReservations.length) {
          $sink.empty().append($srcReservations.clone(true, true));
        } else {
          $sink.text('Information à venir.');
        }
      }).fail(function () {
        /* ignore; leave page as-is */
      });

      /* ---------- #b-noms-prenoms ---------- */
      $.ajax({
        url: URL_NOMS_PRENOMS,
        dataType: 'html',
        timeout: 20000
      }).done(function (html) {
        const $dom = $('<div>').append($.parseHTML(html));
        const $box = $('#b-noms-prenoms');
        if (!$box.length) return;

        const $sinkNoms = $box.find('.nomslisting').first();
        const $sinkPrenoms = $box.find('.prenomslisting').first();

        if ($sinkNoms && $sinkNoms.length) {
          const $srcNoms = $dom.find('#noms_liste');
          if ($srcNoms.length) {
            $sinkNoms.empty().append($srcNoms.clone(true, true));
          } else {
            $sinkNoms.text('Information à venir.');
          }
        }

        if ($sinkPrenoms && $sinkPrenoms.length) {
          // Try #prenonoms_liste first; fallback to #prenoms_liste
          let $srcPrenoms = $dom.find('#prenoms_liste');
          if (!$srcPrenoms.length) {
            $srcPrenoms = $dom.find('#prenoms_liste');
          }
          if ($srcPrenoms.length) {
            $sinkPrenoms.empty().append($srcPrenoms.clone(true, true));
          } else {
            $sinkPrenoms.text('Information à venir.');
          }
        }
      }).fail(function () {
        /* ignore; leave page as-is */
      });
    }

    /* ===================== FLOW ===================== */
    // Kick off static imports immediately
    loadReservationsAndNames();

    const useFresh = hasRefreshParam();
    if (!useFresh) {
      const cached = loadCache();
      if (cached) { renderResults(cached); return; }
    }

    // Crawl → cache → render (for avatars & jobs)
    const results = [];
    let nextId = START_ID, active = 0, misses = 0, stopped = false;

    function finalizeAndRender() { saveCache(results); renderResults(results); }

    function doneIfFinished() {
      if (stopped) return;
      if (active > 0) return;
      if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) {
        finalizeAndRender();
        stopped = true;
      }
    }

    function pump() {
      if (stopped) return;
      while (active < CONCURRENCY && nextId <= MAX_U && misses < STOP_AFTER_MISSES) {
        const id = nextId++;
        if (EXCLUDE.has(id)) continue;

        active++;
        $.ajax({
          url: '/u' + id,
          dataType: 'html',
          timeout: 15000
        }).done(html => {
          const parsed = parseProfile(html);
          if (parsed) { results.push(parsed); misses = 0; }
          else { misses++; }
        }).fail(() => { misses++; })
          .always(() => {
            active--;
            if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) doneIfFinished();
            else pump();
          });
      }
      doneIfFinished();
    }

    pump();
  });
})(window.jQuery);
