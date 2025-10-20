/* Robust starter + logs — if you don't see the first log, a prior <script src="…">
 * with wrong MIME blocked execution. Fix that first.
 */
(function ($) {
  if (!window.jQuery) { console.error('[Lorebook] jQuery missing'); return; }

  $(function () {
    console.log('[Lorebook] init: starting builders');

    // --- sanity checks: mounts must exist ---
    const $avaMount = $('#b-ava .the_overall');
    const $jobMount = $('#b-job .the_overall');
    console.log('[Lorebook] mounts', {
      avaMount: $avaMount.length,
      jobMount: $jobMount.length
    });

    // If neither mount exists, nothing to do.
    if (!$avaMount.length && !$jobMount.length) {
      console.warn('[Lorebook] no mounts found (#b-ava .the_overall or #b-job .the_overall)');
      return;
    }

    // === CONFIG ===
    const EXCLUDE = new Set([1,2,3]);
    const MAX_U = 500;
    const START_ID = 1;
    const CONCURRENCY = 4;
    const STOP_AFTER_MISSES = 50;

    const norm = s => (s||'').toString().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const firstLetter = s => {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : '#';
    };
    const stripStrongKeepContent = $el => { $el.find('strong').each(function(){ $(this).replaceWith($(this).contents()); }); return $el; };

    function parseProfile(html) {
      const $dom = $('<div>').append($.parseHTML(html));
      const $cp  = $dom.find('#cp-main');
      if (!$cp.length) return null;

      const $h1Span = $cp.find('h1 span').first().clone();
      if (!$h1Span.length) return null;
      stripStrongKeepContent($h1Span);

      const featOg   = $cp.find('#field_id-8 .field_uneditable').first().text().trim();
      const artistOg = $cp.find('#field_id1  .field_uneditable').first().text().trim();
      const jobOg    = $cp.find('#field_id-11 .field_uneditable').first().text().trim();

      if (!featOg && !artistOg && !jobOg) return null;

      return {
        featOg, artistOg, jobOg,
        userSpanHTML: $('<div>').append($h1Span).html()
      };
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
    function renderGrouped(entries, groupKey, builderFn, $mount) {
      const groups = new Map();
      entries.forEach(e => {
        const key = firstLetter(groupKey(e));
        if (!key) return;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
      });

      const letters = Array.from(groups.keys()).sort((a,b)=>{
        if (a === '#') return 1;
        if (b === '#') return -1;
        return a.localeCompare(b);
      });

      const frag = document.createDocumentFragment();
      letters.forEach(L => {
        const $section = $('<div class="text_overall"></div>');
        $section.append(`<div class="rule-mini-t">${L} <ion-icon name="arrow-redo-sharp"></ion-icon></div>`);
        groups.get(L).forEach(e => $section.append(builderFn(e)));
        frag.appendChild($section[0]);
      });

      $mount.empty().append(frag);
    }

    // === FETCH crawl with strong logging ===
    const results = [];
    let nextId = START_ID, active = 0, misses = 0, stopped = false;

    function finalize() {
      results.forEach(r => { r._featKey = norm(r.featOg||''); r._jobKey = norm(r.jobOg||''); });

      if ($avaMount.length) {
        const avatarEntries = results.filter(r => r.featOg && r.artistOg)
                                    .sort((a,b)=>a._featKey.localeCompare(b._featKey));
        renderGrouped(avatarEntries, e=>e.featOg, makeAvatarCard, $avaMount);
        console.log('[Lorebook] rendered avatars', avatarEntries.length);
      }
      if ($jobMount.length) {
        const jobEntries = results.filter(r => r.jobOg)
                                  .sort((a,b)=>a._jobKey.localeCompare(b._jobKey));
        renderGrouped(jobEntries, e=>e.jobOg, makeJobCard, $jobMount);
        console.log('[Lorebook] rendered jobs', jobEntries.length);
      }
    }

    function doneIfFinished() {
      if (stopped) return;
      if (active > 0) return;
      if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) {
        console.log('[Lorebook] finalize', { total: results.length, nextId, misses });
        finalize();
        stopped = true;
      }
    }

    function pump() {
      while (active < CONCURRENCY && nextId <= MAX_U && misses < STOP_AFTER_MISSES) {
        const id = nextId++;
        if (EXCLUDE.has(id)) continue;

        active++;
        $.get('/u' + id, function (html) {
          const parsed = parseProfile(html);
          if (parsed) { results.push(parsed); misses = 0; }
          else { misses++; }
        }, 'html').fail(function () {
          misses++;
        }).always(function () {
          active--;
          if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) doneIfFinished();
          else pump();
        });
      }
      doneIfFinished();
    }

    console.log('[Lorebook] crawl start');
    pump();
  });
})(window.jQuery);
