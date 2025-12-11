/* === Lorebook builders with caching (Avatars #b-ava, Jobs #b-job) ============
 * Builds two dynamic sections from user profiles:
 *   - #b-ava: avatars list (feat + bottin_tar + username)
 *   - #b-job: jobs list (job + username)
 *
 * Plus: imports static lists from forum topics into:
 *   - #b-reservation   → .avatars-reserves-list
 *   - #b-noms-prenoms  → .nomslisting / .prenomslisting
 *   - #b-les-dcs       → .dcslisting
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
    const COOKIE_MAX_AGE = 24 * 60 * 60; // 24h

    /* ===================== UTILS ===================== */
    const norm = (s) => (s || '').toString().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const firstLetter = (s) => {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : '#';
    };

    const stripStrongKeepContent = ($el) => {
      $el.find('strong').each(function () {
        $(this).replaceWith($(this).contents());
      });
      return $el;
    };

    function setFlagCookie() {
      document.cookie = `${COOKIE_NAME}=1; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    }
    function clearFlagCookie() {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    }

    function saveCache(results) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(results));
        localStorage.setItem(CACHE_AT, String(Date.now()));
        setFlagCookie();
      } catch (e) {
        try {
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_AT);
        } catch (_) {}
        clearFlagCookie();
      }
    }

    function loadCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        const at  = Number(localStorage.getItem(CACHE_AT) || '0');
        if (!raw || !at) return null;
        if (Date.now() - at > CACHE_TTL_MS) return null;
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : null;
      } catch (_) { return null; }
    }

    function hasRefreshParam() {
      return /(?:\?|&)refresh=1(?:&|$)/.test(location.search);
    }

    /* ===================== PARSER (UPDATED FOR NEW TEMPLATE) ===================== */
    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));

      // New main container
      const $cp = $dom.find('.profil-wrap').first();
      if (!$cp.length) return null;

      // User name from profil-page-ttle span strong
      const $nameStrong = $cp.find('.profil-page-ttle span strong').first();
      if (!$nameStrong.length) return null;
      // keep HTML (e.g. color spans) as userSpanHTML
      const userSpanHTML = $nameStrong.parent().html() || $nameStrong.html() || '';

      // Feat from .rep-id31
      const featOg = $cp.find('.rep-id31').first().text().trim();

      // feat-by HTML from #bottin_tar
      const featByHTML = ($cp.find('#bottin_tar').first().html() || '').trim();

      // Job from .rep-id27
      const jobOg = $cp.find('.rep-id27').first().text().trim();

      // If nothing at all, skip this profile
      if (!featOg && !featByHTML && !jobOg) return null;

      return {
        featOg,
        featByHTML,
        jobOg,
        userSpanHTML
      };
    }

    /* ===================== RENDERERS (UPDATED) ===================== */
    function makeAvatarCard(e) {
      const $c = $('<div class="avatarlisting"></div>');

      // FEAT
      $('<div class="feat-og"></div>').text(e.featOg).appendTo($c);

      // FEAT-BY (uses HTML from #bottin_tar, already formatted)
      if (e.featByHTML) {
        $('<div class="feat-by"></div>').html(e.featByHTML).appendTo($c);
      }

      // USER NAME
      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);

      return $c[0];
    }

    function makeJobCard(e) {
      const $c = $('<div class="joblisting"></div>');

      // JOB
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);

      // USER NAME
      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);

      return $c[0];
    }

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
        const $section = $('<div class="text_overall"></div>')
          .attr('data-kind', kind);
        $section.append(
          `<div class="rule-mini-t">${L} <ion-icon name="arrow-redo-sharp"></ion-icon></div>`
        );
        groups.get(L).forEach(e => $section.append(cardBuilder(e)));
        frag.appendChild($section[0]);
      });

      return frag;
    }

    /* =====================================================
       INSERT FUNCTION (OPTION B)
       Ignores any .text_overall without data-kind
    ====================================================== */
    function insertAfterOverallEnt($rootBox, frag, kind) {
      const $content = $rootBox.find('.overall_content').first();
      if (!$content.length) return;

      // Remove previously generated blocks of this kind
      $content.find(`.text_overall[data-kind="${kind}"]`).remove();

      // Use only script-generated .text_overall (with data-kind) as markers
      const $marker = $content.find('.text_overall[data-kind]').first();

      if ($marker.length) {
        $marker.after(frag);
        return;
      }

      // First insertion → place after .overall-ent if possible
      const $ent = $content.find('.overall-ent').first();
      if ($ent.length) {
        $ent.after(frag);
      } else {
        $content.append(frag);
      }
    }

    function renderResults(results) {
      results.forEach(r => {
        r._featKey = norm(r.featOg || '');
        r._jobKey  = norm(r.jobOg  || '');
      });

      // AVATARS
      const $avaBox = $('#b-ava');
      if ($avaBox.length) {
        const avatarEntries = results
          .filter(r => r.featOg) // require feat for avatar listing
          .sort((a, b) => a._featKey.localeCompare(b._featKey));
        const fragAva = buildGroupedSections(
          avatarEntries,
          e => e.featOg,
          makeAvatarCard,
          'ava'
        );
        insertAfterOverallEnt($avaBox, fragAva, 'ava');
      }

      // JOBS
      const $jobBox = $('#b-job');
      if ($jobBox.length) {
        const jobEntries = results
          .filter(r => r.jobOg)
          .sort((a, b) => a._jobKey.localeCompare(b._jobKey));
        const fragJob = buildGroupedSections(
          jobEntries,
          e => e.jobOg,
          makeJobCard,
          'job'
        );
        insertAfterOverallEnt($jobBox, fragJob, 'job');
      }
    }

    /* ===================== STATIC LIST IMPORTS ===================== */
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
        const $marker = $sink.find('.rule-mini-t').first();

        if ($srcReservations.length) {
          if ($marker.length) $marker.after($srcReservations.clone(true, true));
          else $sink.append($srcReservations.clone(true, true));
        } else {
          const msg = '<div>Information à venir.</div>';
          if ($marker.length) $marker.after(msg);
          else $sink.append(msg);
        }
      }).fail(function () {});

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
          const $marker = $sinkNoms.find('.rule-mini-t').first();
          if ($srcNoms.length) {
            if ($marker.length) $marker.after($srcNoms.clone(true, true));
            else $sinkNoms.append($srcNoms.clone(true, true));
          } else {
            const msg = '<div>Information à venir.</div>';
            if ($marker.length) $marker.after(msg);
            else $sinkNoms.append(msg);
          }
        }

        if ($sinkPrenoms && $sinkPrenoms.length) {
          let $srcPrenoms = $dom.find('#prenoms_liste');
          if (!$srcPrenoms.length) {
            $srcPrenoms = $dom.find('#prenonoms_liste');
          }
          const $marker = $sinkPrenoms.find('.rule-mini-t').first();
          if ($srcPrenoms.length) {
            if ($marker.length) $marker.after($srcPrenoms.clone(true, true));
            else $sinkPrenoms.append($srcPrenoms.clone(true, true));
          } else {
            const msg = '<div>Information à venir.</div>';
            if ($marker.length) $marker.after(msg);
            else $sinkPrenoms.append(msg);
          }
        }
      }).fail(function () {});
    }

    /* ===================== DCS IMPORT ===================== */
    function loadDCs() {
      const URL_DCS = 'https://stella-cinis.forumactif.com/t59-demandes-de-multicomptes-reboots';

      $.ajax({
        url: URL_DCS,
        dataType: 'html',
        timeout: 20000
      }).done(function (html) {
        const $dom = $('<div>').append($.parseHTML(html));

        const $box = $('#b-les-dcs');
        if (!$box.length) return;

        const $sink = $box.find('.dcslisting').first();
        if (!$sink.length) return;

        const $src = $dom.find('#les_dc_a_copier').first();
        const $marker = $sink.find('.rule-mini-t').first();

        if ($src.length) {
          const inner = ($src.html() || "").trim();
          if (inner) {
            if ($marker.length) $marker.after(inner);
            else $sink.append(inner);
          } else {
            const msg = '<div>Information à venir.</div>';
            if ($marker.length) $marker.after(msg);
            else $sink.append(msg);
          }
        } else {
          const msg = '<div>Information à venir.</div>';
          if ($marker.length) $marker.after(msg);
          else $sink.append(msg);
        }
      }).fail(function () {});
    }

    /* ===================== FLOW ===================== */
    loadReservationsAndNames();
    loadDCs();

    const useFresh = hasRefreshParam();
    if (!useFresh) {
      const cached = loadCache();
      if (cached) { renderResults(cached); return; }
    }

    // Crawl → cache → render
    const results = [];
    let nextId = START_ID, active = 0, misses = 0, stopped = false;

    function finalizeAndRender() {
      saveCache(results);
      renderResults(results);
    }

    function doneIfFinished() {
      if (stopped) return;
      if (active > 0) return;
      if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) {
        stopped = true;
        finalizeAndRender();
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
          if (parsed) {
            results.push(parsed);
            misses = 0;
          } else {
            misses++;
          }
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
