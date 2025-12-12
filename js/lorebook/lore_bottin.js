/* ======================================================================
   LOREBOOK BUILDER — SIMPLE, CRAWLER ONLY
   - Builds:
       #b-ava → avatarlisting cards
       #b-job → joblisting cards
   - Crawls public profiles as guest: /u1, /u2, ...
   - Requires that guests can see:
       #profil-info-tar
       .profil-page-ttle
       .rep-id31 (Feat)
       .rep-id27 (Job)
       #bottin_tar (Artist link block)
   ====================================================================== */

(function ($) {
  $(function () {

    console.log("[Lorebook] Bottin script loaded");

    /* ===================== CONFIG ===================== */
    const EXCLUDE          = new Set([1, 2, 3]); // user IDs to skip
    const MAX_U            = 500;                // max user ID to try
    const START_ID         = 1;
    const CONCURRENCY      = 4;                  // parallel requests
    const STOP_AFTER_MISSES = 50;                // consecutive empty profiles → stop

    /* ===================== UTILS ===================== */
    function norm(s) {
      return (s || "")
        .toString()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }

    function firstLetter(s) {
      const c = norm(s).charAt(0).toUpperCase();
      return /^[A-Z]$/.test(c) ? c : "#";
    }

    /* ======================================================================
       PARSER — Reads /uX HTML and extracts data from #profil-info-tar
       ====================================================================== */
    function parseProfile(html) {
      var $dom = $("<div>").append($.parseHTML(html));

      // If FA returned a login / restricted page, skip
      if (html.indexOf("loginform") !== -1 || html.indexOf("Connexion") !== -1) {
        console.warn("[Lorebook] Guest view restricted → skipping profile");
        return null;
      }

      // New template wrapper
      var $cp = $dom.find("#profil-info-tar").first();
      if (!$cp.length) {
        console.warn("[Lorebook] No #profil-info-tar found → skipping");
        return null;
      }

      // Username (HTML)
      var userSpanHTML = ($cp.find(".profil-page-ttle").first().html() || "").trim();

      // Feat
      var featOg = ($cp.find(".rep-id31").first().text() || "").trim();

      // Artist / bottin_tar block (HTML)
      var featByHTML = ($cp.find("#bottin_tar").first().html() || "").trim();

      // Job
      var jobOg = ($cp.find(".rep-id27").first().text() || "").trim();

      // If absolutely nothing, ignore profile
      if (!userSpanHTML && !featOg && !jobOg && !featByHTML) {
        console.warn("[Lorebook] Empty / useless profile → skipping");
        return null;
      }

      return {
        featOg:      featOg,
        featByHTML:  featByHTML,
        jobOg:       jobOg,
        userSpanHTML: userSpanHTML
      };
    }

    /* ======================================================================
       CARD RENDERING
       ====================================================================== */
    function makeAvatarCard(e) {
      var $c = $('<div class="avatarlisting"></div>');
      $('<div class="feat-og"></div>').text(e.featOg).appendTo($c);

      // Artist block from #bottin_tar (HTML already formatted)
      if (e.featByHTML) {
        $('<div class="feat-by"></div>').html(e.featByHTML).appendTo($c);
      }

      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);

      return $c[0];
    }

    function makeJobCard(e) {
      var $c = $('<div class="joblisting"></div>');
      $('<div class="job-og"></div>').text(e.jobOg).appendTo($c);
      $('<div class="user-og"></div>').html(e.userSpanHTML).appendTo($c);
      return $c[0];
    }

    /* ======================================================================
       GROUP BUILDER + INSERTION
       ====================================================================== */
    function buildGroupedSections(entries, groupKeyFn, cardBuilder, kind) {
      var groups = new Map();

      entries.forEach(function (e) {
        var key = firstLetter(groupKeyFn(e));
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
      });

      var letters = Array.from(groups.keys()).sort(function (a, b) {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });

      var frag = document.createDocumentFragment();

      letters.forEach(function (L) {
        var $section = $('<div class="text_overall"></div>').attr("data-kind", kind);
        $section.append(
          '<div class="rule-mini-t">' +
            L +
            ' <ion-icon name="arrow-redo-sharp"></ion-icon></div>'
        );

        groups.get(L).forEach(function (e) {
          $section.append(cardBuilder(e));
        });

        frag.appendChild($section[0]);
      });

      return frag;
    }

    function insertAfterOverallEnt($rootBox, frag, kind) {
      var $content = $rootBox.find(".overall_content").first();
      if (!$content.length) {
        // Fallback: insert directly in #b-ava / #b-job
        $content = $rootBox;
      }

      // Remove previously generated blocks of this kind
      $content.find('.text_overall[data-kind="' + kind + '"]').remove();

      // If we already have script-generated .text_overall, insert after the first one
      var $marker = $content.find(".text_overall[data-kind]").first();
      if ($marker.length) {
        $marker.after(frag);
        return;
      }

      // Else, try to place after .overall-ent
      var $ent = $content.find(".overall-ent").first();
      if ($ent.length) {
        $ent.after(frag);
      } else {
        $content.append(frag);
      }
    }

    function renderResults(results) {
      console.log("[Lorebook] Rendering", results.length, "profiles");

      // Precompute keys
      results.forEach(function (r) {
        r._featKey = norm(r.featOg || "");
        r._jobKey  = norm(r.jobOg  || "");
      });

      // AVATARS
      var $avaBox = $("#b-ava");
      if ($avaBox.length) {
        var avatarEntries = results.filter(function (r) {
          return r.featOg; // need a feat to appear in avatar list
        }).sort(function (a, b) {
          return a._featKey.localeCompare(b._featKey);
        });

        if (avatarEntries.length) {
          var fragAva = buildGroupedSections(
            avatarEntries,
            function (e) { return e.featOg; },
            makeAvatarCard,
            "ava"
          );
          insertAfterOverallEnt($avaBox, fragAva, "ava");
        }
      }

      // JOBS
      var $jobBox = $("#b-job");
      if ($jobBox.length) {
        var jobEntries = results.filter(function (r) {
          return r.jobOg; // need a job for job listing
        }).sort(function (a, b) {
          return a._jobKey.localeCompare(b._jobKey);
        });

        if (jobEntries.length) {
          var fragJob = buildGroupedSections(
            jobEntries,
            function (e) { return e.jobOg; },
            makeJobCard,
            "job"
          );
          insertAfterOverallEnt($jobBox, fragJob, "job");
        }
      }
    }

    // Expose parser & renderer for console debugging if needed
    window.loreBottin = {
      parseProfile:  parseProfile,
      renderResults: renderResults
    };

    /* ======================================================================
       CRAWLER — /u1, /u2, … as guest
       ====================================================================== */

    // If neither target box is present, do nothing
    if (!$("#b-ava").length && !$("#b-job").length) {
      console.log("[Lorebook] No #b-ava / #b-job on this page → abort");
      return;
    }

    var results = [];
    var nextId  = START_ID;
    var active  = 0;
    var misses  = 0;
    var stopped = false;

    function maybeFinish() {
      if (stopped) return;
      if (active > 0) return;

      if (nextId > MAX_U || misses >= STOP_AFTER_MISSES) {
        stopped = true;
        console.log("[Lorebook] Crawl finished. Parsed:", results.length);
        renderResults(results);
      }
    }

    function launchMore() {
      if (stopped) return;

      while (active < CONCURRENCY && nextId <= MAX_U && misses < STOP_AFTER_MISSES) {
        var id = nextId++;
        if (EXCLUDE.has(id)) {
          continue;
        }

        active++;

        $.ajax({
          url: "/u" + id,
          dataType: "html",
          timeout: 15000
        })
        .done(function (html) {
          var parsed = parseProfile(html);
          if (parsed) {
            results.push(parsed);
            misses = 0;
            console.log("[Lorebook] Accepted u" + id);
          } else {
            misses++;
            console.log("[Lorebook] Skipped u" + id, "(misses:", misses + ")");
          }
        })
        .fail(function () {
          misses++;
          console.warn("[Lorebook] AJAX fail on u" + id, "(misses:", misses + ")");
        })
        .always(function () {
          active--;
          maybeFinish();
          launchMore();
        });
      }

      // In case loop doesn't schedule anything (e.g., all EXCLUDE),
      // check if we can finish.
      maybeFinish();
    }

    console.log("[Lorebook] Starting crawl from u" + START_ID + " to u" + MAX_U);
    launchMore();

  });
})(window.jQuery);
