$(function () {
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

    if($('.owl-carousel').length){
        $('.owl-carousel').owlCarousel({
            margin: 10,
            loop: true,
            nav:false,
            dots:false,
            responsive:{
                0:{
                    items:1
                },
                768:{
                    items:2
                },
                1920:{
                    items:3
                }
            }
        });
    }
});