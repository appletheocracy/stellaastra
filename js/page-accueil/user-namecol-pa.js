const couleurUser = _userdata.groupcolor;
$(function(){
  $('.pa_nom_user').html(_userdata.username);
  $('#pa_welcome').css('color','#' + couleurUser);
});
