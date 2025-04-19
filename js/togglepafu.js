function togglePaFu() {
    var element = document.getElementById("scPAw");    
    var content = document.getElementById("padiffsc");
    if(element.style.opacity == "0", element.style.height == "0px") {
        content.innerHTML = "Plier la<br/>page d'accueil";
        element.style.opacity = "1";
        element.style.height = "280px"
        element.style.display = "inline-block"
        element.style.transition = "all 0.5s ease-in-out";
    } else {
        content.innerHTML = "Déplier la<br/>page d'accueil";
        element.style.opacity = "0";
        element.style.height = "0px"
        element.style.display = "none"
        element.style.transition = "all 0.5s ease-in-out";
    }
}
