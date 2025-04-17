
  window.addEventListener('DOMContentLoaded', lastMSG () {
    var leftDiv = document.getElementById('left');
    var targetDiv = document.getElementById('derniers_sujets');

    if (leftDiv && targetDiv) {
      targetDiv.innerHTML = leftDiv.innerHTML;
      leftDiv.style.display = 'none';
    }
  });
