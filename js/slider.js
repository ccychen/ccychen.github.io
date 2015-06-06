function Slider($slider, config) {
    var _$slider = $slider;
    var _numOfImages = 0;
    var _interval = config["interval"] * 1000;
    var _tranSpeed = config["transitionSpeed"];
    var _isRendering = false;
    var _timer = null;

    Init();

    function Init() {
        var imgUrls = config["images"];
        _numOfImages = imgUrls.length;
        $dotDiv = $("<DIV/>").addClass("dots");

        //image
        for (var i = 0; i < _numOfImages; i++) {
            //image
            var $img = $("<IMG/>").attr({ "src": imgUrls[i], "idx": i }).addClass("image");

            //dot
            var $dot = $("<DIV/>").attr("idx", i).addClass("dot");
            $img.oriIndex = i;

            if (i == 0) {
                $dot.addClass("current");
            } else {
                $dot.addClass("normal");
                $dot.click({ idx: i }, function (e) {
                    Show(e.data.idx);
                });
            }

            $slider.append($img);
            $dotDiv.append($dot);

        }

        $slider.append($dotDiv);

        //start
        _timer = window.setTimeout(Show, _interval);
    }

    //show the idx-th ot the next image
    function Show(idx) {
        if (_isRendering) {
            return;
        }

        window.clearTimeout(_timer);

        //current image
        var $curr = _$slider.children("IMG.image:first-child");
        var currIdx = parseInt($curr.attr("idx"));

        //next image
        if (idx == undefined) {
            idx = currIdx + 1 < _numOfImages ? currIdx + 1 : 0;
        }
        var $nxt = _$slider.children("IMG.image[idx=" + idx + "]");

        //move the next image to the second
        $nxt.insertAfter($curr);

        //set dot controller
        var $dots = _$slider.children("DIV.dots");

        var $currDot = $dots.children("DIV[idx=" + currIdx + "]");
        var $nxtDot = $dots.children("DIV[idx=" + idx + "]");
        $currDot.removeClass("current").addClass("normal").click({ idx: currIdx }, function (e) {
            Show(e.data.idx);
        });
        $nxtDot.removeClass("normal").addClass("current").unbind("click");

        Render();
    }

    function Render() {
        _isRendering = true;
        var $frst = _$slider.children(".image:first-child");
        if ($frst.css("opacity") > 0) {
            $frst.css("opacity", $frst.css("opacity") - 0.05);
            window.setTimeout(Render, _tranSpeed);
        } else {
            $frst.insertAfter(_$slider.children(".image:nth-child(2)"));
            $frst.css("opacity", 1);
            _isRendering = false;
            _timer = window.setTimeout(Show, _interval);
        }
    }
}