

(function ($) {
   
    var timer;
    var password;
    var menu;
    var passWindow;
    var incPassWindow;
    $(document).ready(function () {

        menu = new $.slidebars().slidebars;
        passWindow = $('[data-remodal-id=modal]').remodal();
        incPassWindow = $('[data-remodal-id=incorrect]').remodal();
        loadPassword();
        loadColors();
        menu.open('left');
    });

    $('body').mousemove(
      function () {
          if (event.pageX < 10 && !menu.active('left')) {
              menu.open('left');
          }
            onStartMove();
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            timer = setTimeout(function () {
                onEndMove();
            }, 3000);

      }
    );
    
    $('#fullscreen').click(function () {
        var isFS = !($(document).fullScreen());
        $(document).toggleFullScreen();
        $("#fs-icon").toggleClass("fa-expand", !isFS);
        $("#fs-icon").toggleClass("fa-compress", isFS);
      
        
    });

    $('#unlock-button').click(function () {
      
        passWindow.open();


    });

    $(document).on('confirmation', '[data-remodal-id=modal]', function () {
        var pass = $("#password").val();
        $("#password").val("");
        if (validPass(pass)) {
            Cookies.set('password', pass);
            password = pass;
            $("#color-list").empty();
            loadColors();
        }
        else {
            incPassWindow.open();
        }
        
        
    });

    $(document).on('confirmation', '[data-remodal-id=incorrect]', function () {
        passWindow.open();
    });
   
    $(window).bind("fullscreen-toggle", function (e, isFS) {
        $("#fs-icon").toggleClass("fa-expand", !isFS);
        $("#fs-icon").toggleClass("fa-compress", isFS);
    });

    function loadPassword() {
        password = Cookies.get('password');
        if (password) $("#color-list").empty();
           
    }

    function onStartMove() {
        $('#fixed-top').animate({ top: 0, opacity: 1 }, { queue: false });
        $('#fixed-bottom').toggle(password != null);
        if (password != null) $('#fixed-bottom').animate({ bottom: 0, opacity: 1 }, { queue: false });
    }

    function onEndMove() {
        $('#fixed-top').animate({ top: -50, opacity: 0 }, { queue: false });
        if (password != null) $('#fixed-bottom').animate({ bottom: -50, opacity: 0 }, { queue: false });
        
    }

    function loadColors() {

        
        for (var i = 0; i < colors.length; i++) {
            if (password!=null) {
                colors[i].description = Tea.decrypt(colors[i].description, password);
            }
            var item = $('<li><div class="color-item"><div class="color-box" style="background-color:' + colors[i].color + '"></div>' + colors[i].title + '<span class="small-description"><br />' + colors[i].description + '</span></div></li>');
            item.data({ colorData: colors[i] });
            $('#color-list').append(item);
            $(".small-description").toggle(password != null);
            $('#fixed-bottom').toggle(password != null);
            $('.color-item').parent().click(
               function () {
                   chooseColor($(this).data("colorData"));
                   menu.close()

               }
           );
        }
        chooseColor(colors[0]);
    }

    function chooseColor(colorData) {
        if (colorData) {
            $('body').css("background-color", colorData.color);
            $('#title').text(colorData.title);
            if (password != null) {
                $('#big-description').text(colorData.description);
            } else {
                $('#big-description').text("");
            }
        }
    }

    function validPass(pass) {
        return (Tea.decrypt("dvh+XhuF375V10uEghHYcwDgkrZ5FESi2uCexQ==", pass) == "Correct Password.. yeey! ");
        
    }
})(jQuery);