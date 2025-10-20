/* === Lorebook builders: Avatars (#b-ava) & Jobs (#b-job) ======================
 * Page: https://stella-cinis.forumactif.com/h3-lorebook
 *
 * Collects user info from /u# (except u1,u2,u3)
 *   - #field_id-8   → Feat
 *   - #field_id1    → Artist
 *   - #field_id-11  → Job
 *   - h1 span       → Username (with color)
 *
 * Builds alphabetical lists:
 *   - Avatars → inside #b-ava .the_overall (after .overall-ent.r-droite)
 *   - Jobs    → inside #b-job  .the_overall (after .overall-ent)
 *
 * NO creation or wrapping of .the_overall — uses existing HTML.
 * ============================================================================ */

(function ($) {
  $(function () {

    /* ===== Config ===== */
    const EXCLUDE = new Set([1, 2, 3]);
    const MAX_U = 500;
    const START_ID = 1;
    const CONCURRENCY = 4;
    const STOP_AFTER_MISSES = 50;

    /* ===== Utils ===== */
    const norm = (s) => (s || '').toString().trim().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const firstLetter = (s) => {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : '#';
    };

    const stripStrongKeepContent = ($el) => {
      $el.find('strong').each(function () {
        const $s = $(this);
        $s.replaceWith($s.contents());
      });
      return $el;
    };

    /* ===== Parse Each Profile ===== */
    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));
      const $cp = $dom.find('#cp-main');
      if (!$cp.length) return null;

      const $h1Span = $cp.find('h1 span').first().clone();
      if (!$h1Span.length) return null;
      stripStrongKeepContent($h1Span);

      const featOg   = $cp.find('#field_id-8 .field_uneditable').first().text().trim();
      const artistOg = $cp.find('#field_id1 .field_uneditable').first().text().trim();
      const jobOg    = $cp.find('#field_id-11 .field_uneditable').first().text().trim();

      if (!featOg && !artistOg && !jobOg) return null;

      return {
        featOg,
        artistOg,
        jobOg,
        userSpanHTML: $('<div>').append($h1Span).html()
      };
    }

    /* ===== Render Helpers ===== */
    function renderGrouped(entries, groupKey, builderFn, $mount) {
      const groups = new Map();
      entries.forEach(e => {
        const key = firstLetter(groupKey(e));
        if (!key) return;
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
        const $section = $('<div class="text_overall"></div>');
        $section.append(
          `<div class="rule-mini-t">${L} <ion-icon name="arrow-redo-sharp"></ion-icon></div>`
        );
        groups.get(L).forEach(e => $section.append(builderFn(e)));
        frag.appendChild($section[0]);
      });

      $mount.empty().append(frag);
    }

    function makeAvatarCard(e) {
      const $c = $('<div class="avatarlisting"></div>');
      $('<div class="feat-og"></div>').text(e.featOg).appendTo($c);
      $('<div class="feat-by">par</div>').appendTo($c);
      $('<div class="artist-og"></div>').text(e.artistOg).appendTo($c);
      $('<div class="user-og"></div>').html(' ' + e.userSpanHTML).appendTo($c);
      return $c[0];
    }

    function makeJobCard(e) {
      const $c = $('<div class="joblisting"></div>');
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);
      $('<div class="user-og"></div>').html(' ' + e.userSpanHTML).appendTo($c);
      return $c[0];
    }

    /* ===== Fetch & Process ===== */
    const results = [];
    let nextId = START_ID;
    let active = 0;
    let misses = 0;
    let stopped = false;

    function finalize() {
      results.forEach(r => {
        r._featKey = norm(r.featOg || '');
        r._jobKey = norm(r.jobOg || '');
      });

      /* === AVATARS === */
      const $avaOverall = $('#b-ava .the_overall');
      if ($avaOverall.length) {
        const avatarEntries = results.filter(r => r.featOg && r.artistOg);
        avatarEntries.sort((a, b) => a._featKey.localeCompare(b._featKey));
        renderGrouped(avatarEntries, e => e.featOg, makeAvatarCard, $avaOverall);
      }

      /* === JOBS === */
      const $jobOverall = $('#b-job .the_overall');
      if ($jobOverall.length) {
        const jobEntries = results.filter(r => r.jobOg);
        jobEntries.sort((a, b) => a._jobKey.localeCompare(b._jobKey));
        renderGrouped(jobEntries, e => e.jobOg, makeJobCard, $jobOverall);
      }
    }

    function doneIfFinished() {
      if (stopped) return;
      if (active > 0) return;
      if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) {
        finalize();
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
          if (parsed) {
            results.push(parsed);
            misses = 0;
          } else misses++;
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
