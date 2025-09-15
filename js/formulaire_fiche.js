// formulaire_div.js
$(document).ready(function () {
  const $formWrapper = $('.form_wrapper_contour');
  const $groupeInput = $('#groupe');
  const $groupe2Input = $('#groupe2');

  const maxQuali = 10;

  /* ===========================
   * INITIAL QUALI_DEF (ensure 4)
   * =========================== */
  const $qualiTemplate = $('.quali_def').first();
  for (let i = $('.quali_def').length; i < 4; i++) {
    const $clone = $qualiTemplate.clone(true, true);
    $clone.find('input').val('');
    $clone.insertAfter($('.quali_def').last());
  }

  /* ===========================
   * GROUP BUTTONS
   * =========================== */
  $('.entete_groupe input[type="button"]').on('click', function () {
    $('.entete_groupe input[type="button"]').removeClass('selected');
    $formWrapper.removeClass('vampire chimere hybride humain groupe_large');
    $(this).addClass('selected');

    if ($(this).hasClass('fiche_btn_vampire')) {
      $formWrapper.addClass('vampire');
      $groupeInput.val('vampire');
      $groupe2Input.val('vampire');
    } else if ($(this).hasClass('fiche_btn_chimere')) {
      $formWrapper.addClass('groupe_large chimere');
      $groupeInput.val('chimère');
      $groupe2Input.val('chimere');
    } else if ($(this).hasClass('fiche_btn_hybride')) {
      $formWrapper.addClass('hybride');
      $groupeInput.val('hybride');
      $groupe2Input.val('hybride');
    } else if ($(this).hasClass('fiche_btn_humain')) {
      $formWrapper.addClass('humain');
      $groupeInput.val('humain');
      $groupe2Input.val('humain');
    }
  });

  /* ===========================
   * QUALI_DEF LOGIC (min 4, up to 10)
   * Each block always has "+"; when total >=5 every block also has "−".
   * Never let total drop below 4.
   * =========================== */
  $(document).on('click', '.quali_def .add_quali_def', function () {
    const $blocks = $('.quali_def');
    if ($blocks.length >= maxQuali) return;

    const $current = $(this).closest('.quali_def');
    const $clone = $current.clone(true, true);
    $clone.find('input').val('');
    $clone.insertAfter($current);

    updateQualiButtons();
  });

  $(document).on('click', '.quali_def .remove_quali_def', function () {
    const $blocks = $('.quali_def');
    if ($blocks.length <= 4) return; // keep min 4
    $(this).closest('.quali_def').remove();
    updateQualiButtons();
  });

  function updateQualiButtons() {
    const $blocks = $('.quali_def');
    const total = $blocks.length;

    // enforce minimum 4
    if (total < 4) {
      for (let i = total; i < 4; i++) {
        const $clone = $('.quali_def').first().clone(true, true);
        $clone.find('input').val('');
        $clone.insertAfter($('.quali_def').last());
      }
    }

    const $all = $('.quali_def'); // refresh
    $all.each(function (index) {
      const $wrap = $(this);

      // strip old fiche_qualiteX classes
      $wrap.removeClass(function (i, cn) {
        return (cn.match(/(^|\s)fiche_qualite\d+/g) || []).join(' ');
      });
      $wrap.addClass('fiche_qualite' + index);

      // ensure 1 input, re-id/name
      const $inp = $wrap.find('input[type="text"]').first();
      if ($inp.length) {
        $inp.attr({ id: 'quali_def' + index, name: 'quali_def_' + index });
      }

      // rebuild buttons: always "+"; add "−" only if total >= 5
      $wrap.find('.add_quali_def, .remove_quali_def').remove();
      $wrap.append('<div class="btn add_quali_def">+</div>');
      if ($all.length >= 5) {
        $wrap.append('<div class="btn remove_quali_def">-</div>');
      }
    });
  }

  /* ===========================
   * CHRONO LOGIC (unlimited)
   * =========================== */
  $(document).on('click', '.chrono .add_chrono', function () {
    const $currentBlock = $(this).closest('.chrono');
    const $newBlock = $currentBlock.clone(true, true);

    // Clear values in the clone
    $newBlock.find('input').val('');
    $newBlock.find('textarea').val('');

    // Ensure "+" and "−" exist
    if ($newBlock.find('.add_chrono').length === 0) {
      $newBlock.append('<div class="btn add_chrono"> + </div>');
    }
    if ($newBlock.find('.remove_chrono').length === 0) {
      $newBlock.append('<div class="btn remove_chrono"> - </div>');
    }

    // CRITICAL: normalize visibility (avoid cloning display:none from the first block)
    $newBlock.find('.remove_chrono').css('display', '');

    // Insert before the final chrono block
    $('.chrono_final').before($newBlock);

    updateChronoButtons();
  });

  $(document).on('click', '.chrono .remove_chrono', function () {
    const $block = $(this).closest('.chrono');
    const isFirst = $('.chrono').not('.chrono_final').first().is($block);
    if (!isFirst) {
      $block.remove();
      updateChronoButtons();
    }
  });

  function updateChronoButtons() {
    const $blocks = $('.chrono').not('.chrono_final');

    $blocks.each(function (index) {
      const $this = $(this);

      // Re-index fields
      $this.find('input[name^="date_annee"], input[id^="date_annee"]').attr({
        id: 'date_annee_' + index,
        name: 'date_annee_' + index
      });

      $this.find('input[name^="date_mois"], input[id^="date_mois"]').attr({
        id: 'date_mois_' + index,
        name: 'date_mois_' + index
      });

      $this.find('textarea[name^="chrono"], textarea[id^="chrono"]').attr({
        id: 'chrono_' + index,
        name: 'chrono_' + index
      });

      // Ensure buttons exist
      if ($this.find('.add_chrono').length === 0) {
        $this.append('<div class="btn add_chrono"> + </div>');
      }
      if ($this.find('.remove_chrono').length === 0) {
        $this.append('<div class="btn remove_chrono"> - </div>');
      }

      // CRITICAL: normalize visibility per index
      if (index === 0) {
        $this.find('.remove_chrono').hide();   // first cannot be removed
      } else {
        $this.find('.remove_chrono').show();   // all others must be visible
      }
    });

    // Final block never shows buttons
    $('.chrono_final .add_chrono, .chrono_final .remove_chrono').hide();
  }

  /* ===========================
   * COMPILATION_FACTS (unlimited)
   * Always show "+"; show "−" on all but the first
   * =========================== */
  $(document).on('click', '.compilation_facts .add_fact', function () {
    const $currentBlock = $(this).closest('.compilation_facts');
    const $newBlock = $currentBlock.clone(true, true);

    $newBlock.find('input').val('');
    $newBlock.insertAfter($currentBlock);

    updateFactsButtons();
  });

  $(document).on('click', '.compilation_facts .remove_fact', function () {
    const $block = $(this).closest('.compilation_facts');
    const $blocks = $('.compilation_facts');
    const index = $blocks.index($block);
    if (index === 0) return; // first cannot be removed

    $block.remove();
    updateFactsButtons();
  });

  function updateFactsButtons() {
    const $blocks = $('.compilation_facts');

    $blocks.each(function (index) {
      const $this = $(this);
      $this.find('.add_fact, .remove_fact').remove();

      $this.append('<div class="btn add_fact"> + </div>');
      if (index > 0) {
        $this.append('<div class="btn remove_fact"> - </div>');
      }

      $this.find('input').attr({
        id: 'facts_' + index,
        name: 'facts_' + index
      });
    });
  }

  /* ===========================
   * COMPILATION_SIGNES (unlimited)
   * Always show "+"; show "−" on all but the first
   * =========================== */
  $(document).on('click', '.compilation_signes .add_signe', function () {
    const $currentBlock = $(this).closest('.compilation_signes');
    const $newBlock = $currentBlock.clone(true, true);

    $newBlock.find('input').val('');
    $newBlock.insertAfter($currentBlock);

    updateSignesButtons();
  });

  $(document).on('click', '.compilation_signes .remove_signe', function () {
    const $block = $(this).closest('.compilation_signes');
    const $blocks = $('.compilation_signes');
    const index = $blocks.index($block);
    if (index === 0) return; // first cannot be removed

    $block.remove();
    updateSignesButtons();
  });

  function updateSignesButtons() {
    const $blocks = $('.compilation_signes');

    $blocks.each(function (index) {
      const $this = $(this);
      $this.find('.add_signe, .remove_signe').remove();

      $this.append('<div class="btn add_signe"> + </div>');
      if (index > 0) {
        $this.append('<div class="btn remove_signe"> - </div>');
      }

      $this.find('input').attr({
        id: 'signes_' + index,
        name: 'signes_' + index
      });
    });
  }

  /* ===========================
   * INITIAL & GLOBAL RECOMPUTE
   * =========================== */
  updateQualiButtons();
  updateChronoButtons();
  updateFactsButtons();
  updateSignesButtons();

  // Expose updaters so the hydration script can call them:
  window.updateQualiButtons  = updateQualiButtons;
  window.updateChronoButtons = updateChronoButtons;
  window.updateFactsButtons  = updateFactsButtons;
  window.updateSignesButtons = updateSignesButtons;

  // Also listen for a custom event fired after hydration
  $(document).on('form:rehydrated', function(){
    updateQualiButtons();
    updateChronoButtons();
    updateFactsButtons();
    updateSignesButtons();
  });
});
