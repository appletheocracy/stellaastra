$(function () {
  var href = window.location.href;

  var map = {
    '/f8-vampires':  'f8',
    '/f15-chimeres':'f15',
    '/f10-hybrides':'f10',
    '/f9-humains': 'f9'
  };

  $.each(map, function (path, cls) {
    if (href.indexOf(path) !== -1) {
      $('.mainBGN').addClass(cls);
      return false; // stop dès qu'on trouve
    }
  });
});
