//Thumb Box
function ThumbBox(tBox, images, config, changeImageEvent) {
    //configuration
    var _tBox = tBox;
    var _images = images;
    var _config = {
        "images_per_page": 20,
        "folder": "",
    };

    for (key in config) {
        _config[key] = config[key];
    }

    /*initialize*/
    var _numPages = 1, _pageNum = 1;
    Init();

    function Init() {
        //calculate pages
        var len = _images.length;
        _numPages = Math.ceil(len / _config["images_per_page"]);
        _pageNum = 1;

        Render(_pageNum);
    }

    //render method
    function Render(page) {
        var startIdx = _config["images_per_page"] * (page - 1);
        var endIdx = startIdx + _config["images_per_page"] - 1;
        endIdx = _images.length - 1 < endIdx ? _images.length - 1 : endIdx;

        //clear rows
        _tBox.empty();
        for (var i = startIdx; i <= endIdx; i++) {
            var $img = $("<IMG/>").addClass("cell").attr("src", _config["folder"] + _images[i][0])
            $img.click({ id: _images[i][0] }, function (e) {
                changeImageEvent(e.data.id);
            });

            _tBox.append($img);
        }
    }

    this.NumbrOfPage = function () {
        return _numPages;
    }

    this.Show = function (page) {
        Render(page);
    }
}