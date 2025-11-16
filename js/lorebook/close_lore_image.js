$('.close_lore_image').on('click', function () {
    if (window.history.length > 1) {
        window.history.back();   // go back to previous tab/page
    } else {
        // fallback: go to first tab
        $('.mainmenu').removeClass('select');
        $('.mainmenu[href="#intro"]').addClass('select');
        document.querySelector('#intro').scrollIntoView({behavior:'smooth'});
    }
});
