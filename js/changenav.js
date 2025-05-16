$(document).ready(function(){
   /* $(".sujTree").each(function(){
        console.log($(this).text());
        var ddot = $(this).text().replace('::', '>');
        $(this).text(ddot);
    });*/    

    $(".sujTree").html(function(i, h){
        return h.replace(/::/g,'>');
    });
});
