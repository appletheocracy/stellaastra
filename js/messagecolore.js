$(function() {
    $('.postprofile-name a[href^="/u"] span').each(function() {
        var colgrp = $(this).css('color');

        if (colgrp === 'rgb(50, 109, 224)') {
            $(this).css('color', 'white');
            $(this).closest('div.post').addClass('message_deus');
        } else if (colgrp === 'rgb(255, 205, 97)') {
            $(this).css('color', 'white');
            $(this).closest('div.post').addClass('message_pnj');
        } else if (colgrp === 'rgb(192, 131, 207)') {
            $(this).css('color', 'white');
            $(this).closest('div.post').addClass('message_hybride');
        } else if (colgrp === 'rgb(212, 17, 62)') {
            $(this).css('color', 'white');
            $(this).closest('div.post').addClass('message_vampire');
        } else if (colgrp === 'rgb(109, 156, 114)') {
            $(this).css('color', 'white');
            $(this).closest('div.post').addClass('message_humain');
        } else{
            $(this).css('color', 'white');
  	}
    });
});
