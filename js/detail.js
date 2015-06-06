//Thumb Box
function ThumbBox(tBox, images, config, changeImageEvent) {
    //configuration
    var _tBox = tBox;
    var _thumbs = tBox.children(".thumbs");
    var _pager = tBox.children(".pager");
    var _images = images;
    var _config = {
        "images_per_page": 12,
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
        _thumbs.empty();

        for (var i = startIdx; i <= endIdx; i++) {
            var $img = $("<IMG/>").addClass("cell").attr("src", _config["folder"] + _images[i][0])
            $img.click({ id: _images[i][0] }, function (e) {
                changeImageEvent(e.data.id);
            });

            _thumbs.append($img);
        }

        //left pager
        _pager.empty();
        if (page > 1) {
            var $left = $("<DIV/>").addClass("arrow left").click(function () {
                Render(page - 1);
            });
            _pager.append($left);

        }

        if (page < _numPages) {
            var $right = $("<DIV/>").addClass("arrow right").click(function () {
                Render(page + 1);
            });
            _pager.append($right);
        }
    }

    this.NumbrOfPage = function () {
        return _numPages;
    }

    this.Show = function (page) {
        Render(page);
    }
}

//pager
function Pager1(pager, numPage, changePageEvent) {
    var _pager = pager;
    var _currPage = 1;

    function Render() {
        //var $pagerBox = $("<div/>");
        _pager.empty();
        if (numPage == 1) {
            return;
        }
        //_pager.append($pagerBox);
        for (var i = 1; i <= numPage; i++) {
            var $page = $("<span/>");
            $page.text(i);
            if (i == _currPage) {
                $page.addClass("selected");
            } else {
                $page.click({ page: i }, function (e) {
                    _currPage = e.data.page;
                    Render();
                    changePageEvent(_currPage);
                });
            }
            _pager.append($page);
        }
    }

    Render();
}