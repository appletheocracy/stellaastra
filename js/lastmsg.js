function lastMSG(){
    var content = document.getElementById("left");
    var scpaw = document.getElementById("scPAw");
    var dsdepla = document.getElementById("derniers_sujets");

    if(scpaw.style.width == "1200px"){
        content.style.height = "0px";
        content.style.overflow = "hidden";
        dsdepla.innerHTML = content.innerHTML;
    } else {
    }
}
