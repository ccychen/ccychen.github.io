function adjSlider() {
    if ($(window).width() > 854) {
        $('.owl-carousel').show()
    } else {
        $('.owl-carousel').hide();
    }
}

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
        adjSlider();
    });

    $('.owl-carousel').owlCarousel({
        margin: 10,
        loop: true,
        nav:false,
        dots:true,
        autoWidth:true
    });
    adjSlider();
});