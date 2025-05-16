$(document).ready(function(){
    $('.sujTree a.nav[href=""]').hide();
    $(".sujTree").html(function(i, h){
        return h.replace(/&nbsp;::&nbsp;/g,' > ');
    });
});
