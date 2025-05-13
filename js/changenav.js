$(document).ready(function(){
    $(".sujTree").html(function(i, t){
        return t.replace('::',' > ');
    });
});