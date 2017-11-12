//Grid View
function SerialBox(sb, folders, config) {
    //configuration
    var _sb = sb;
    var _folders = folders;
    var _config = {
        "folder_width": 294,
        "margin": 10,
        "css_class": "SerialBox",
        "path": "works/serial/cover/"
    };

    for (key in config) {
        _config[key] = config[key];
    }

    /*initialize*/
    var _foldersPerRow, _numPages = 1, _pageNum = 1;
    Render();

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
            row.Add(_folders[i][0], _folders[i][1], _config["path"] + _folders[i][2])
        }

        if (row.NumbrOfFolder()) {
            _rows.push(row);
        }

        _sb.width(_config["width"]);

        Render(_pageNum);
    }

    //render method
    function Render() {
        var startIdx = 0;
        var endIdx = _folders.length;

        //clear rows
        _sb.empty();
        for (var j = startIdx; j < endIdx; j++) {
            var $folder = $("<div/>");
            var f = _folders[j];
            
            $folder.addClass("col-xs-4 col-sm-3 cell");
            $folder.click({ folder: f[0] }, function (e) {
                var url = "detail.html?cate=serial&id=" + e.data.folder;
                window.open(url, '_blank');
            });

            var $frame = $("<div/>");
            $frame.addClass("frame");
            $folder.append($frame);

            var $thumbImg = $("<IMG/>");
            $thumbImg.attr('src', _config.path + f[2]);
            $frame.append($thumbImg);

            var $caption = $("<div/>");
            $caption.addClass("caption");
            $caption.html(f[1]);
            $frame.append($caption);

            _sb.append($folder);
        }
    }
}