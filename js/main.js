$(document).ready(function () {

    var $paint = $("#navigator").children(".painting");
    $paint.mouseover(function () {
        $paint.html("COMEING SOON");
    });

    $paint.mouseout(function () {
        $paint.html("PAINTING");
    });
});

//Album
function Album(album, images, config) {
    var _$album = album;
    var _images = images;
    var _rows = [];
    var _config = {
        "width":900,
        "target_row_height": 240,
        "max_row_height": 240,
        "margin": 20,	//for calculation, also define in css
        "img_path":""
    }

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
        var _isLastRow = false;

        this.Add = function (fileName, oriWidth, oriHeight) {
            var scaledWidth = Math.ceil(oriWidth / (oriHeight / _tarHeight));
            if ((_width + scaledWidth + _margin * (_numImgs + 1) < _tarWidth) //the image is narrow than space
				|| (_tarWidth - _width - _margin * (_numImgs + 1) > (scaledWidth + _margin) / 2)) { //space > image width / 2
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
            var ratio = (_tarWidth - _margin * (_numImgs + 1)) / _width;
            if (ratio > 1 && _isLastRow) {
                return _tarHeight;
            }
            var h = Math.round(_tarHeight * ratio);
            return h;
        }

        this.getImage = function (idx) {
            return _images[idx];
        }

        this.setLastRowFlag = function () {
            _isLastRow = true;
        }
    }

    function Render() {
        var numRow = _rows.length;
        var startIdx = 0;
        var endIdx = _rows.length;

        //clear rows
        _$album.empty();
        for (var i = startIdx ; i < endIdx; i++) {
            var r = _rows[i];

            var $row = $("<div/>");
            $row.height(r.height()).addClass("row");
            for (var j = 0; j < r.numbrOfImage() ; j++) {
                var $link = $("<A target='blank'/>").attr("href", _config["img_path"] + r.getImage(j)[0]);
                var $img = $("<img/>").attr("src", _config["img_path"] + r.getImage(j)[0]);
                $img.attr("height", r.height());
                $link.append($img);
                $row.append($link);
            }

            _$album.append($row);
        }
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
                _rows.push(row);
                row = new Row(_config["width"], _config["target_row_height"], _config["margin"]);
            } else {
                i++;
            }
        }
        if (row.numbrOfImage() > 0) {
            row.setLastRowFlag();
            _rows.push(row);
        }

        //calculate pages
        _numOfPages = Math.ceil(_rows.length / _config["rows_per_page"]);


        Render();
    }

    this.Resize = function (width) {
        _config["width"] = width;
        Init();
    }
}