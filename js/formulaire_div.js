$(document).ready(function () {
    const $formWrapper = $('.form_wrapper_contour');
    const $groupeInput = $('#groupe');
    const $groupe2Input = $('#groupe2');
    const maxQuali = 10;
    let qualiCounter = 1;

    // Ensure 5 quali_def blocks exist on page load
    const initialQualiCount = 4;
    const $qualiTemplate = $('.quali_def').first();
    for (let i = 1; i < initialQualiCount; i++) {
        const $clone = $qualiTemplate.clone();
        $clone.find('input').val('');
        $clone.insertAfter($('.quali_def').last());
    }

    updateQualiButtons();

    $('.entete_groupe input[type="button"]').on('click', function () {
        $('.entete_groupe input[type="button"]').removeClass('selected');
        $formWrapper.removeClass('vampire chimere hybride humain');
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

    // --- QUALI_DEF LOGIC ---
    $(document).on('click', '.quali_def .add_quali_def', function () {
        const $allBlocks = $('.quali_def');
        if ($allBlocks.length >= maxQuali) return;

        const $currentBlock = $(this).closest('.quali_def');
        const $newBlock = $currentBlock.clone();

        $newBlock.find('input').val('');
        $newBlock.insertAfter($currentBlock);

        updateQualiButtons();
    });

    $(document).on('click', '.quali_def .remove_quali_def', function () {
        $(this).closest('.quali_def').remove();
        updateQualiButtons();
    });

    function updateQualiButtons() {
        const $blocks = $('.quali_def');
        const total = $blocks.length;

        $blocks.each(function (index) {
            const $this = $(this);

            // Remove any previous numbered classes and buttons
            $this.removeClass(function (i, className) {
                return (className.match(/(^|\s)fiche_qualite\d+/g) || []).join(' ');
            });

            $this.addClass('fiche_qualite' + index);
            $this.find('.add_quali_def, .remove_quali_def').remove();

            // Update input attributes
            $this.find('input').attr({
                id: 'quali_def' + index,
                name: 'quali_def_' + index
            });

            // --- Button logic ---
            if (index <= 2) {
                return; // Never show buttons for the first 3
            }

            if (index === 3) {
                // Block 3: only show "+" if total ≤ 4 and it's last
                if (index === total - 1 && total <= 4) {
                    $this.append('<div class="btn add_quali_def"> + </div>');
                }
                return; // never show "-"
            }

            if (index >= 4 && index < 9 && index < total - 1) {
                // Blocks 4–8, not last: show only remove
                $this.append('<div class="btn remove_quali_def"> - </div>');
            }

            if (index === total - 1 && total < 10) {
                // Last block < 10: show both
                $this.append('<div class="btn add_quali_def"> + </div>');
                $this.append('<div class="btn remove_quali_def"> - </div>');
            }

            if (index === 9 && total === 10) {
                // 10th block (index 9), show only remove
                $this.append('<div class="btn remove_quali_def"> - </div>');
            }
        });

        qualiCounter = $blocks.length;
    }




    // --- CHRONO LOGIC (unlimited) ---
    $(document).on('click', '.chrono .add_chrono', function () {
    const $currentBlock = $(this).closest('.chrono');
    const $newBlock = $currentBlock.clone();

    $newBlock.find('input').val('');
    $newBlock.find('textarea').val('');
    $newBlock.find('.remove_chrono').show();

    // Insert before the final chrono block
    $('.chrono_final').before($newBlock);
    updateChronoButtons();
    });
    
    $(document).on('click', '.chrono .remove_chrono', function () {
        const $block = $(this).closest('.chrono');
        if (!$block.hasClass('chrono_final')) {
            $block.remove();
            updateChronoButtons();
        }
    });
    
    function updateChronoButtons() {
        const $blocks = $('.chrono').not('.chrono_final');
    
        $blocks.each(function (index) {
            const $this = $(this);
            $this.find('input[name^="date_annee"]').attr({
                id: 'date_annee_' + index,
                name: 'date_annee_' + index
            });
            $this.find('input[name^="date_mois"]').attr({
                id: 'date_mois_' + index,
                name: 'date_mois_' + index
            });
            $this.find('textarea').attr({
                id: 'chrono_' + index,
                name: 'chrono_' + index
            });
        });
    
        // Show all remove buttons, hide on first
        $blocks.find('.remove_chrono').show();
        $blocks.first().find('.remove_chrono').hide();
    
        // Always hide buttons in the final block
        $('.chrono_final .add_chrono, .chrono_final .remove_chrono').hide();
    }
    
    // Initial hide for first block's remove button
    $('.chrono').not('.chrono_final').first().find('.remove_chrono').hide();
    
    // Initial setup
    updateChronoButtons();


    // --- COMPILATION_FACTS LOGIC (unlimited) ---
    $(document).on('click', '.compilation_facts .add_fact', function () {
        const $currentBlock = $(this).closest('.compilation_facts');
        const $newBlock = $currentBlock.clone();

        $newBlock.find('input').val('');
        $newBlock.insertAfter($currentBlock);
        updateFactsButtons();
    });

    $(document).on('click', '.compilation_facts .remove_fact', function () {
        $(this).closest('.compilation_facts').remove();
        updateFactsButtons();
    });

    function updateFactsButtons() {
        const $blocks = $('.compilation_facts');

        $blocks.each(function (index) {
            const $this = $(this);
            $this.find('.add_fact, .remove_fact').remove();

            if (index === $blocks.length - 1) {
                $this.append('<div class="btn add_fact"> + </div>');
                $this.append('<div class="btn remove_fact"> - </div>');
            }

            $this.find('input').attr({
                id: 'facts_' + index,
                name: 'facts_' + index
            });
        });
    }


    // --- COMPILATION_SIGNES LOGIC (unlimited) ---
    $(document).on('click', '.compilation_signes .add_signe', function () {
        const $currentBlock = $(this).closest('.compilation_signes');
        const $newBlock = $currentBlock.clone();

        $newBlock.find('input').val('');
        $newBlock.insertAfter($currentBlock);
        updateSignesButtons();
    });

    $(document).on('click', '.compilation_signes .remove_signe', function () {
        $(this).closest('.compilation_signes').remove();
        updateSignesButtons();
    });

    function updateSignesButtons() {
        const $blocks = $('.compilation_signes');

        $blocks.each(function (index) {
            const $this = $(this);
            $this.find('.add_signe, .remove_signe').remove();

            if (index === $blocks.length - 1) {
                $this.append('<div class="btn add_signe"> + </div>');
                $this.append('<div class="btn remove_signe"> - </div>');
            }

            $this.find('input').attr({
                id: 'signes_' + index,
                name: 'signes_' + index
            });
        });
    }

});
