$(document).ready(function(){
    $('.sujTree a.nav[href=""]').hide();
    $(".sujTree").html(function(i, h){
        return h.replace(/&nbsp;::&nbsp;/g,' > ');
    });

    $('.pagination a.nav[href="javascript:Pagination();"]').addClass(stPageNumber);
    $(".pagination .pag-img").html(function(i, t){
        return t.replace('<img src="https://2img.net/i/fa/modernbb/arrow_right.png" alt="Suivant" loading="lazy">',' > ');
    });
});
