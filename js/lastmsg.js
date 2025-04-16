function lastMSG(){
    var content = document.getElementById("left");
    var dsdepla = document.getElementById("derniers_sujets");

    if(content.style.width == "190px"){
        var contenu = content.innerHTML;
        content.style.height = "0px";
        content.style.overflow = "hidden";
        dsdepla.innerHTML = contenu;
    } else {

    }
}
