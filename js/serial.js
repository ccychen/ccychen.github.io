//Grid View
function SerialBox(sb, folders, config) {
    //configuration
    var _sb = sb;
    var _folders = folders;
    var _rows = [];
    var _config = {
        "width": 960,
        "folder_width": 280,
        "margin": 10,
        "rows_per_page": 2,
        "css_class": "SerialBox",
        "path": "works/serials/"
    };

    for (key in config) {
        _config[key] = config[key];
    }

    /*initialize*/
    var _foldersPerRow, _numPages = 1, _pageNum = 1;
    Init();

    //inner classes
    function Row(rowWidth, folderWidth, margin) {
        var _folders = [];
        var _rowWidth = rowWidth;
        var _folderWidth = folderWidth;
        var _margin = margin;
        var _numFolders = 0;

        this.Add = function (f, c, tUrl) {
            _folders.push([f, c, tUrl]);
            _numFolders++;
        }

        this.getFolderInfo = function (idx) {
            return _folders[idx];
        }

        this.NumbrOfFolder = function () {
            return _numFolders;
        }
    }

    function Init() {
        //calculate pages
        _foldersPerRow = Math.round((_config["width"] + _config["margin"]) / (_config["folder_width"] + _config["margin"]));
        var numRow = Math.ceil(_folders.length / _foldersPerRow);
        _numPages = Math.ceil(numRow / _config["rows_per_page"]);
        _pageNum = 1;

        _rows = [];
        row = new Row(_config["width"], _config["folder_width"], _config["margin"]);
        var len = _folders.length;
        for (var i = 0; i < len; i++) {
            if (i != 0 && i % _foldersPerRow == 0) {
                _rows.push(row);
                row = new Row(_config["width"], _config["folder_width"], _config["margin"]);
            }
            row.Add(_folders[i][0], _folders[i][1], _config["path"] + _folders[i][0] + "/thumb.jpg")
        }

        if (row.NumbrOfFolder()) {
            _rows.push(row);
        }

        _sb.width(_config["width"]);

        Render(_pageNum);
    }

    //render method
    function Render(page) {
        var startIdx = _config["rows_per_page"] * (page - 1);
        var endIdx = startIdx + _config["rows_per_page"] - 1;
        endIdx = _rows.length - 1 < endIdx ? _rows.length - 1 : endIdx;

        //clear rows
        _sb.empty();
        for (var i = startIdx; i <= endIdx; i++) {
            var r = _rows[i];
            var $row = $("<DIV/>").addClass("row");

            for (var j = 0; j < _foldersPerRow ; j++) {
                var $folder = $("<div/>");
                $row.append($folder);

                if (j < r.NumbrOfFolder()) {
                    var f = r.getFolderInfo(j);

                    $folder.addClass("cell");
                    $folder.click({ folder: f[0] }, function (e) {
                        var url = "detail.html?cate=serial&id=" + e.data.folder;
                        window.open(url, '_blank');
                    });

                    var $thumb = $("<div/>");
                    $thumb.addClass("thumb");
                    $folder.append($thumb);

                    var $thumbImg = $("<IMG/>");
                    $thumbImg.attr('src', f[2]);
                    $thumb.append($thumbImg);

                    var $caption = $("<div/>");
                    $caption.addClass("caption");
                    $caption.html(f[1]);
                    $folder.append($caption);
                } else {
                    //fake
                    $folder.addClass("fake_cell");
                }
            }

            _sb.append($row);
        }
    }

    this.Resize = function (width) {
        _config["width"] = width;
        _pageNum = 1;
        Init();
    }

    this.NumbrOfPage = function () {
        return _numPages;
    }

    this.Show = function (page) {
        Render(page);
    }
}