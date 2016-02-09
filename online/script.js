

(function ($) {
   
    var timer,lastMouseMove;
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
        if (password == null) passWindow.open();
        $(".filltext").textfill({ maxFontPixels: 24 });
        $("#desc-container").textfill({ maxFontPixels: 16 });
        
        
    });

    $(window).resize(function () {
        $(".filltext").textfill({ maxFontPixels: 24 });
        $("#desc-container").textfill({maxFontPixels:16});
    });

    $('body').mousemove(
      function () {
          if (event.pageX < $('body').width()*0.03 && !menu.active('left')) {
              menu.open('left');
          }
          showHeaders();

      }
    );
    $('#sb-site').dblclick(
      function () {
          $(document).toggleFullScreen();
      }
    );


    

    $('#fullscreen').click(function () {
        $(document).toggleFullScreen();
     
        
    });

   

    $('#unlock-button').click(function () {
      
        passWindow.open();


    });

    $(document).on('confirmation', '[data-remodal-id=modal]', function () {
        submitPassword();
        
        
    });

    $('#password').keypress(function (e) {
        if (e.which == 13) {
            passWindow.close();
            submitPassword();
            return false; 
        }
    });

    $(document).on('confirmation', '[data-remodal-id=incorrect]', function () {
        passWindow.open();
    });
   
    $(window).bind("fullscreen-toggle", function (e, isFS) {
        $("#fs-icon").toggleClass("fa-expand", !isFS);
        $("#fs-icon").toggleClass("fa-compress", isFS);
    });

    function submitPassword() {
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
    }

    function loadPassword() {
        password = Cookies.get('password');
        if (password) $("#color-list").empty();
           
    }




    function showHeaders() {
        $('#fixed-top').animate({ top: 0, opacity: 1 }, { queue: false });
        $('#fixed-bottom').toggle(password != null);
        $('body').css('cursor', '');
        if (password != null) {
            
            $('#fixed-bottom').animate({ bottom: 0, opacity: 1 }, { queue: false });
        }
        
        if (!timer) {
            timer = setInterval(function () {
                if (lastMouseMove && new Date().getTime() - lastMouseMove.getTime() >= 2000) {
                    clearInterval(timer);
                    timer = null;
                    // end moving
                    $('body').css('cursor', 'none');
                    $('#fixed-top').animate({ top: -50, opacity: 0 }, { queue: false });
                    if (password != null) $('#fixed-bottom').animate({ bottom: -50, opacity: 0 }, { queue: false });
                }
            }, 100);
        }
        lastMouseMove = new Date();
    }
    function loadColors() {

        
        for (var i = 0; i < colors.length; i++) {
            if (password!=null) {
                colors[i].description = Tea.decrypt(colors[i].description, password);
            }
            var item = $('<li><div class="color-item"><div class="color-box" style="background-color:' + colors[i].color + '"></div><span class="list-title">' + colors[i].title + '</span><span class="small-description">' + colors[i].description + '</span></div></li>');
            item.data({ colorData: colors[i] });
            $('#color-list').append(item);
            
           
            $('.color-item').parent().click(
               function () {
                   chooseColor($(this).data("colorData"));
                   menu.close()

               }
           );
        }
        $(".small-description").toggle(password != null);
        $(".list-title").css({
            "line-height": password == null ? "40px" : "",
            "font-size": password == null ? "18px" : "",
        });
        $('#fixed-bottom').toggle(password != null);
        chooseColor(colors[0]);
    }

    function chooseColor(colorData) {
        if (colorData) {
            $('body').css("background-color", colorData.color);
            $('#title').text(colorData.title);
            if (password != null) {
                $('#big-description').text(colorData.description);
                $("#desc-container").textfill({ maxFontPixels: 16 });
            } else {
                $('#big-description').text("");
            }
            showHeaders();
        }
    }

    function validPass(pass) {
        return (Tea.decrypt("dvh+XhuF375V10uEghHYcwDgkrZ5FESi2uCexQ==", pass) == "Correct Password.. yeey! ");
        
    }
})(jQuery);