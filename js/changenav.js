$(document).ready(function(){
    $('.sujTree a.nav[href=""]').hide();
    $(".sujTree").html(function(i, h){
        return h.replace(/&nbsp;::&nbsp;/g,' > ');
    });
   
    $(".pag-img").html(function(i, h){
        return h.replace(/<img src="https://2img.net/i/fa/modernbb/arrow_right.png" alt="Suivant" loading="lazy">/g,' > ');
    });
});
