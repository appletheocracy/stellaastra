/* === Lorebook builders with caching (Avatars #b-ava & Jobs #b-job) ============
 * Fast reloads via cache:
 *  - Saves parsed profile data once into localStorage (much larger than cookies).
 *  - Also sets a tiny cookie flag for your requirement (visibility + TTL control).
 *  - On subsequent loads, if cache is fresh, renders instantly and SKIPS crawling.
 *
 * Force refresh anytime with ?refresh=1 in the URL.
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
        // If storage is full or blocked, clear and move on gracefully
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
        const age = Date.now() - at;
        if (age > CACHE_TTL_MS) return null; // stale
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return null;
        return data;
      } catch (_) {
        return null;
      }
    }

    function hasRefreshParam() {
      return /(?:\?|&)refresh=1(?:&|$)/.test(location.search);
    }

    /* ===================== PARSER ===================== */
    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));
      const $cp  = $dom.find('#cp-main');
      if (!$cp.length) return null;

      const $h1Span = $cp.find('h1 span').first().clone();
      if (!$h1Span.length) return null;
      stripStrongKeepContent($h1Span);

      const featOg   = $cp.find('#field_id-8  .field_uneditable').first().text().trim();
      const artistOg = $cp.find('#field_id1   .field_uneditable').first().text().trim();
      const jobOg    = $cp.find('#field_id-11 .field_uneditable').first().text().trim();

      if (!featOg && !artistOg && !jobOg) return null;

      return {
        featOg,
        artistOg,
        jobOg,
        userSpanHTML: $('<div>').append($h1Span).html()
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
      return $c[0];
    }

    function makeJobCard(e) {
      const $c = $('<div class="joblisting"></div>');
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);
      $('<div class="feat-by">-</div>').appendTo($c);
      $('<div class="user-og"></div>').html(' ' + e.userSpanHTML).appendTo($c);
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
        const $section = $('<div class="text_overall"></div>').attr('data-kind', kind);
        $section.append(
          `<div class="rule-mini-t">${L} <ion-icon name="arrow-redo-sharp"></ion-icon></div>`
        );
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
      // derive sort keys once
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

    /* ===================== FLOW ===================== */
    const useFresh = hasRefreshParam();
    if (!useFresh) {
      const cached = loadCache();
      if (cached) {
        // Instant paint from cache, then stop (fast reload)
        renderResults(cached);
        return;
      }
    }

    // No (valid) cache → crawl now, then save & render
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
