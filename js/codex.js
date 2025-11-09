$(function () {
  $('.text_rules code').each(function () {
    const $code = $(this);
    if ($code.data('escaped')) return;      // skip if already processed
    const html = $code.html();              // get the inner HTML
    $code.text(html).attr('data-escaped', 1); // replace with literal text
  });
});
