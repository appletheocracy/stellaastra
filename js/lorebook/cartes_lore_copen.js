$(function () {

  /* ===========================================================
   *  FULL IMAGE OVERLAY on .carte-lore click
   * =========================================================== */

  // Inject overlay structure once
  if (!$('#imgOverlay').length) {
    $('body').append(`
      <div id="imgOverlay" style="display:none;">
        <div class="imgOverlay-bg"></div>
        <div class="imgOverlay-content">
          <button class="imgOverlay-close">✕</button>
          <center><img class="imgOverlay-img" src="" alt=""></center>
        </div>
      </div>
    `);
  }

  // Styles (pure CSS injected so you don't have to edit stylesheet)
  const overlayCSS = `
    #imgOverlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 40px;
    }

    #imgOverlay .imgOverlay-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    #imgOverlay .imgOverlay-img {
      max-width: 70%;
      max-height: 70%;
      object-fit: contain;     /* critical for tall images */
      border-radius: 6px;
      box-shadow: 0 0 20px rgba(0,0,0,.4);
    }

    #imgOverlay .imgOverlay-close {
      position: absolute;
      top: -25px;
      right: -25px;
      background: #fff;
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
    }

    #imgOverlay .imgOverlay-close:hover {
      transition: .5s;
      animation-timing-function:ease-in-out;
      background: var(--cdeu);
      color:var(--cff);
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
    }

    #imgOverlay .imgOverlay-bg {
      position: absolute;
      inset: 0;
    }
  `;

  $('<style>').text(overlayCSS).appendTo('head');

  // Open overlay
  $(document).on('click', 'img.carte-lore', function () {
    const src = $(this).attr('src');
    $('.imgOverlay-img').attr('src', src);
    $('#imgOverlay').fadeIn(200);
  });

  // Close overlay by X
  $(document).on('click', '.imgOverlay-close', function () {
    $('#imgOverlay').fadeOut(200);
  });

  // Close overlay by clicking outside the image
  $(document).on('click', '.imgOverlay-bg', function () {
    $('#imgOverlay').fadeOut(200);
  });

});
