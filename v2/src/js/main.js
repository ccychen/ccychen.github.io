function changeLanguage(lang) {
    $('[class*= lang-]').hide();
    $('[class*= lang-' + lang + ']').show();
}

$(function () {
    $("img").on("contextmenu", function () {
        return false;
    });

    $(".mobile-nav-toggle").click(function () {
        if ($("#mobile-nav").hasClass("active")) {
            $("#mobile-nav").removeClass("active");
        } else {
            $("#mobile-nav").addClass("active");
        }
        return false;
    });

    $(window).resize(function () {
        $("#mobile-nav").removeClass("active");
    });

    if ($('.owl-carousel').length) {
        $('.owl-carousel').owlCarousel({
            margin: 10,
            loop: true,
            nav: false,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                1920: {
                    items: 3
                }
            }
        });
    }

    $(".langSelector").click(function (obj) {
        var lang = obj.target.dataset.lang;
        if (lang) {
            $(".langSelector").removeClass("selected");
            changeLanguage(lang);
            $(obj.target).addClass("selected");
        }
    });

    changeLanguage("en");
});
