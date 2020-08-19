$(document).on('click','.mdl-list .mdl-list__item', function () {
    $('.mdl-list .mdl-list__item').removeClass('active');
    $(this).addClass('active');
    var index = $(this).index();
    $('.mdl-layout__content .mdl-layout__tab-panel').css('display', 'none').eq(index).css('display','block');
});

$('.code_cover_html .code_input').each(function(key, val) {
    new CodeFlask(val, { language: 'html' });
});

$('.code_cover_css .code_input').each(function(key, val) {
    new CodeFlask(val, { language: 'css' });
});

$(document).on('click','#startTimer', function () {
    var userhash = $(this).data('userhash');
    $.ajax({
        url: '/start',
        type: "POST",
        data: {"userhash": userhash},
        success: function (res) {
            console.log(res);
        }
    });
});

$(document).on('click','form .mdl-button', function () {
    var BUTTON = $(this);
    var USERHASH = $(this).closest('form').data('userhash');
    var TASK = $(this).closest('form').data('task');
    var HTML = $(this).closest('form').find('.code_cover_html textarea').val();
    var CSS = $(this).closest('form').find('.code_cover_css textarea').val();
    var COMMENT = $(this).closest('form').find('.comment textarea').val();

    var DATATASK = {
        userhash: USERHASH,
        task: TASK,
        html: HTML,
        css: CSS,
        comment: COMMENT
    };

    /*var str = JSON.stringify();*/

    $.ajax({
        url: '/commitTask',
        type: "POST",
        data: DATATASK,
        success: function (res) {
            console.log(res);
            BUTTON.addClass('ready');
            BUTTON.html('Отправлено')
        }
    });
});


$(document).ready(function () {
    var userhash = $('#timer').data('userhash');
    var wayuserhash = '/timer/' + userhash;
    console.log(userhash);
    $.ajax({
        url: wayuserhash,
        type: "GET",
        success: function (res) {
            if(parseInt(res, 10) <= 0){
                $('#timer').html('Время вышло. Спасибо за работу!');
            }else{
                tracker(res);
                var IntervalTime = setInterval(function() {
                    var step = res - 1000;
                    res = step;
                    if(parseInt(res, 10) === 0){
                        $('#timer').html('Время вышло. Спасибо за работу!');
                        clearInterval(IntervalTime);
                    }else{
                        tracker(res);
                    }
                }, 1000);
            }
        }
    });
});

function tracker(res) {
    var seconds = res / 1000;
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    $('#timer').html(time);
}
