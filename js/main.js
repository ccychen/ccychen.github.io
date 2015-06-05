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
            var $dot = $("<DIV/>").attr("idx", i ).addClass("dot");
            $img.oriIndex = i;

            if (i == 0) {
                $dot.addClass("current");
            } else {
                $dot.addClass("normal");
                $dot.click({idx: i}, function (e) {
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

//Album
function Album(album, images, config) {
    var _$album = album;
    var _images = images;
    var _rows = [];
    var _config = {
        "width": 960,
        "target_row_height": 240,
        "max_row_height":260,
        "margin": 12,	//for calculation, also define in css
        "rows_per_page": 3,
        "image_folder": "works/sketch/"
    }

    var _numOfPages = 1, _pageNum = 1;

    for (key in config) {
        _config[key] = config[key];
    }

    Init();

    //
    function Row(tarWidth, tarHeight, margin) {
        var _images = [];
        var _tarHeight = tarHeight;
        var _tarWidth = tarWidth;
        var _margin = margin;
        var _width = 0;
        var _numImgs = 0;

        this.Add = function (fileName, oriWidth, oriHeight) {
            var scaledWidth = Math.ceil(oriWidth / (oriHeight / _tarHeight));
            if ((_width + scaledWidth + _margin * _numImgs < _tarWidth) //the image is narrow than space
				|| (_tarWidth - _width - _margin * _numImgs > (scaledWidth + _margin) / 2)) { //space > image width / 2
                //append
                _images.push([fileName, oriWidth, oriHeight]);
                _numImgs++;
                _width += scaledWidth;
                return true;
            } else {
                //full
                return false;
            }
        }

        this.numbrOfImage = function () {
            return _numImgs;
        };

        this.height = function () {
            var ratio = (_tarWidth - _margin * _numImgs) / _width;
            console.log("trW, wd:", _tarWidth, _width);
            var h = Math.round(_tarHeight * ratio);
            return h;
        }

        this.getImage = function (idx) {
            return _images[idx];
        }
    }
    this.Show = function (page) {
        Render(page);
    }

    function Render(page) {
        var rowPerPage = _config["rows_per_page"];
        var numRow = _rows.length;
        var startIdx = rowPerPage * (page - 1);
        var endIdx = startIdx + rowPerPage;
        endIdx = numRow < endIdx ? numRow : endIdx;
   
        //clear rows
        _$album.empty();

        for (var i = startIdx ; i < endIdx; i++) {
            var r = _rows[i];

            var $row = $("<div/>");
            $row.height(r.height()).addClass("row");
            console.log("row height", r.height());
            for (var j = 0; j < r.numbrOfImage() ; j++) {
                var $img = $("<img/>").attr("src", _config["image_folder"] + r.getImage(j)[0]);

                $row.append($img);
            }

            _$album.append($row);
        }

        _pageNum = page;
    }

    function Init() {
        _rows = [];
        var row = new Row(_config["width"], _config["target_row_height"], _config["margin"]);
        var len = _images.length;
        var i = 0;
        while (i < len) {
           
            var width = _images[i][1];
            var height = _images[i][2];

            if (!row.Add(_images[i][0], _images[i][1], _images[i][2])) {
                //new row;
                _rows.push(row); console.log("row added", row.numbrOfImage()); console.log("row added", row.numbrOfImage());
                row = new Row(_config["width"], _config["target_row_height"], _config["margin"]);
            } else {
                i++;
            }
        }
        if (row.numbrOfImage() > 0) {
            _rows.push(row);
        }

        //calculate pages
        _numOfPages = Math.ceil(_rows.length / _config["rows_per_page"]);
        console.log("image, row, page", len, _rows.length,  _numOfPages);

        //
        _$album.width(_config["width"]);

        Render(_pageNum);
    }



    this.Resize = function (width) {
        _config["width"] = width;
        _pageNum = 1;
        Init();
    }

    this.NumbrOfPage = function () {
        return _numOfPages;
    }
}

//Grid View
function GridView(gv, cfg, data) {
    //configuration
    var _gv = gv;

    var _data = data;
    var _cfg = {
        columns: 3,
        rows_per_page: 2,
        css_class: "SerialBox"
    };

    /*initialize*/
    var _columns = _cfg["columns"];
    var _rowPerPage = _cfg["rows_per_page"];
    var _cssClass = _cfg["css_class"];

    //calculate pages
    var _numSerials = _data.length;
    var _numRows = Math.ceil(_numSerials / _columns);
    var _numPages = Math.ceil(_numRows / _rowPerPage);

    //inner classes
    function Row() {
        var $row = $("<div/>");
        $row.addClass(_cssClass);
        $row.addClass("row");
        _gv.append($row);

        this.Add = function (f, c, tUrl) {
            var $cell = $("<div/>");
            $cell.addClass(_cssClass);
            $cell.addClass("cell");
            $cell.click({ folder: f }, function (e) {
                var url = "list.html?cate=serial&id=" + e.data.folder;
                window.open(url, '_blank');
            });

            $row.append($cell);

            var $thumb = $("<div/>");
            $thumb.addClass("thumb");
            $cell.append($thumb);

            var $thumbImg = $("<IMG/>");
            $thumbImg.attr('src', tUrl);
            $thumb.append($thumbImg);

            var $caption = $("<div/>");
            $caption.addClass("caption");
            $caption.html(c);
            $cell.append($caption);
        }

        this.jQueryObject = function () {
            return $row;
        }
    }

    //render method
    this.Render = function (page) {

        var startIdx = _columns * _rowPerPage * (page - 1);
        var endIdx = startIdx + _columns * _rowPerPage - 1;
        endIdx = _numSerials - 1 < endIdx ? _numSerials - 1 : endIdx;

        //clear rows
        _gv.empty();

        var row;
        for (var i = startIdx; i <= endIdx; i++) {

            if (i % _columns == 0) {
                if (row) {
                    _gv.append(row.jQueryObject());
                }

                //new row
                row = new Row();
            }

            row.Add(_data[i][0],	//folder 
					_data[i][1],  	//caption
					SERIAL_FOLDER + _data[i][0] + "/thumb.jpg"); //thumb folder is defined in file serials.list 
        }

        if (row) {
            _gv.append(row.jQueryObject());
        }
    };

    this.NumbrOfPage = function () {
        return _numPages;
    }
}


//pager
function Pager(pager, numPage, changePageEvent) {
    var _pager = pager;
    var _currPage = 1;

    function Render() {
        //var $pagerBox = $("<div/>");
        _pager.empty();
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