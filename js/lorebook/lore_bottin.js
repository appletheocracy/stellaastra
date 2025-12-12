/* ======================================================================  
   LOREBOOK BUILDER — FINAL PATCHED VERSION  
   Avatars (#b-ava), Jobs (#b-job), full crawler, hardened extraction  
   Compatible with: https://stella-cinis.forumactif.com/uX  
   ====================================================================== */

(function ($) {
  $(function () {

    console.log("LOREBOOK SCRIPT LOADED!");

    /* ===================== CONFIG ===================== */
    const EXCLUDE = new Set([1, 2, 3]); // ignored users
    const MAX_U = 500;
    const START_ID = 1;
    const CONCURRENCY = 4;
    const STOP_AFTER_MISSES = 50;

    const CACHE_KEY = 'lorebook_cache_v1_data';
    const CACHE_AT  = 'lorebook_cache_v1_time';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
    const COOKIE_NAME = 'lorebook_cache_v1';
    const COOKIE_MAX_AGE = 24 * 60 * 60;

    /* ===================== UTILS ===================== */
    const norm = s => (s || '').toString().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const firstLetter = s => {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : '#';
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
      } catch (_) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_AT);
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
      return /(?:\?|&)refresh=1/.test(location.search);
    }

    /* ======================================================================
       PARSER — Guest-safe, template-aware
       ====================================================================== */

    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));

      // Detect FA login screens
      if (html.includes("loginform") || html.includes("Connexion")) {
        console.warn("Guest view restricted — skipping profile.");
        return null;
      }

      // Main wrapper
      const $cp = $dom.find('#profil-info-tar').first();
      if (!$cp.length) {
        console.warn("No #profil-info-tar found → skipping");
        return null;
      }

      const userSpanHTML = ($cp.find('.profil-page-ttle').first().html() || "").trim();

      // FEAT
      let featOg = ($cp.find('.rep-id31').first().text() || "").trim();
      const featFallback = ($dom.find('#field_id31 .field_uneditable').text() || "").trim();
      if (!featOg && featFallback) featOg = featFallback;

      // ARTIST + LINK (HTML)
      let featByHTML = ($cp.find('#bottin_tar').first().html() || "").trim();

      // JOB
      let jobOg = ($cp.find('.rep-id27').first().text() || "").trim();
      const jobFallback = ($dom.find('#field_id27 .field_uneditable').text() || "").trim();
      if (!jobOg && jobFallback) jobOg = jobFallback;

      if (!userSpanHTML && !featOg && !jobOg) {
        console.warn("Profile has no useful data → skipping");
        return null;
      }

      console.log("Parsed OK:", { featOg, featByHTML, jobOg, userSpanHTML });

      return {
        featOg,
        featByHTML,
        jobOg,
        userSpanHTML
      };
    }

    /* ======================================================================
       CARD RENDERING
       ====================================================================== */

    function makeAvatarCard(e) {
      const $c = $('<div class="avatarlisting"></div>');
      $('<div class="feat-og"></div>').text(e.featOg).appendTo($c);
      $('<div class="feat-by"></div>').html(e.featByHTML).appendTo($c);
      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);
      return $c[0];
    }

    function makeJobCard(e) {
      const $c = $('<div class="joblisting"></div>');
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);
      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);
      return $c[0];
    }

    /* ======================================================================
       GROUP BUILDER + SAFE INSERTION
       ====================================================================== */

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
