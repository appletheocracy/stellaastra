$(function(){
    const userID = _userdata["user_id"];
    const userContact = '/u' + _userdata["user_id"];
    
    // Load field_id6 for "Fiche" 
    $('<div>').load(userContact + ' #field_id6 div.field_uneditable', function () {
        const ficheLink = $(this).find('div').text().trim();
        $('a.pa_pro_fiche').attr('href', ficheLink);
    });
    
    // Load field_id24 for "Carnet" 
    $('<div>').load(userContact + ' #field_id24 div.field_uneditable', function () {
        const carnetLink = $(this).find('div').text().trim();
        $('a.pa_pro_carnet').attr('href', carnetLink);
    });
    
    $('a.pa_pro_profile').attr('href', '/u'+userID);
    $('a.pa_pro_msg').attr('href', '/spa/u'+userID);
    $('a.pa_pro_suj').attr('href', '/sta/u'+userID);
});

