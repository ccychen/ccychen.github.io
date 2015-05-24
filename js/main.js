//Grid View
function GridView(gv, cfg, data){
	//configuration
	var _gv = gv;

	var _data = data;
	var _cfg = {
		columns:3,
		rows_per_page:2,
		css_class:"SerialBox"
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
	function Row(){
		var $row = $("<div/>");
		$row.addClass(_cssClass);
		$row.addClass("row");
		_gv.append($row);
		
		this.Add = function(f, c, tUrl){
			var $cell = $("<div/>");
			$cell.addClass(_cssClass);
			$cell.addClass("cell");
			$cell.click({folder:f}, function(e){
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
		
		this.jQueryObject = function(){
			return $row;
		}
	}
	
	//render method
	this.Render = function(page){
	
		var startIdx = _columns * _rowPerPage * (page - 1);
		var endIdx = startIdx + _columns * _rowPerPage - 1;
		endIdx = _numSerials-1 < endIdx? _numSerials-1 : endIdx;
		
		//clear rows
		_gv.empty();
		
		var row;
		for(var i=startIdx; i <= endIdx; i++){
			
			if(i%_columns == 0){
				if(row){
					_gv.append(row.jQueryObject());
				}
				
				//new row
				row = new Row();
			}
			
			row.Add(_data[i][0],	//folder 
					_data[i][1],  	//caption
					SERIAL_FOLDER + _data[i][0] + "\\thumb.jpg"); //thumb folder is defined in file serials.list 
		}
		
		if(row){
			_gv.append(row.jQueryObject());
		}
	};
	
	this.NumbrOfPage = function(){
		return _numPages;
	}
}

//Album
function Album(album, images, config){
	var _config = {
		width: 840,
		target_row_height: 200,
		margin: 12,	//for calculation, also define in css
		rows_per_page: 4,
		image_folder:"works/sketch/"
	}
	
	var _images = images;
	var imgLen = _images.length;
	var _image_thumb_folder = _config["image_folder"] + "thumb/";
	var _tarRowWidth = _config["width"];
	var _tarRowHeight = _config["target_row_height"];
	var _margin = _config["margin"];
	
	var _rows = [];
	var _rowPerPage = _config["rows_per_page"];
	var _$album = album;

	_$album.width(_tarRowWidth);
	InitRowList();
	
	//calculate pages
	var _numRows = _rows.length;
	var _numPages = Math.ceil(_numRows / _rowPerPage);
	
	//
	function Row(tarWidth, tarHeight, margin){
		var _images = [];
		var _tarHeight = tarHeight;
		var _tarWidth = tarWidth;
		var _margin = margin;
		var _width = 0;
		var _numImgs = 0;
		
		this.Add = function(fileName, oriWidth, oriHeight){
			var scaledWidth = Math.ceil(oriWidth / (oriHeight / _tarHeight));
			if((_width + scaledWidth + _margin * _numImgs < _tarWidth) //the image is narrow than space
				|| (_tarWidth - _width - _margin * _numImgs > (scaledWidth + _margin)/2)){ //space > image width / 2
				//append
				_images.push([fileName, oriWidth, oriHeight]);
				_numImgs++;
				_width += scaledWidth;
				return true;
			}else{
				//full
				return false;
			}
		}
		
		this.numbrOfImage = function(){
			return _numImgs;
		};
		
		this.height = function(){
			var ratio = (_tarWidth - _margin * _numImgs) / _width;
			return Math.round(_tarHeight * ratio);
		}
		
		this.getImage = function(idx){
			return _images[idx];
		}
	}
	
	function InitRowList(){
		var row = new Row(_tarRowWidth, _tarRowHeight, _margin);
		for(var i=0; i < imgLen; i++){
			var width = _images[i][1];
			var height = _images[i][2];
			
			if(!row.Add(_images[i][0], _images[i][1], _images[i][2])){
				//new row;
				_rows.push(row);
				row = new Row(_tarRowWidth, _tarRowHeight, _margin);
				
			}
		}
	}

	this.Render = function(page){

		var startIdx = _rowPerPage * (page - 1);
		var endIdx = startIdx + _rowPerPage;
		endIdx = _numRows < endIdx? _numRows : endIdx;
		console.log("row, page,start, end:",_numRows,page, startIdx, endIdx);
		
		//clear rows
		_$album.empty();
		
		
		for(var i = startIdx ; i < endIdx; i++){			
			var r = _rows[i];
			
			var $row = $("<div/>");
			$row.height(r.height()).addClass("row");
			
			
			for(var j=0; j < r.numbrOfImage(); j++){
				var $img = $("<img/>").attr("src", _image_thumb_folder + r.getImage(j)[0]);
				
				$row.append($img);
			}
			
			_$album.append($row);
		}
	}
	
	this.NumbrOfPage = function(){
		return _numPages;
	}
}

//pager
function Pager(pager, numPage, changePageEvent){
	var _pager = pager;
	var _currPage = 1;
	
	function Render(){
		var $pagerBox = $("<div/>");
		_pager.empty();
		_pager.append($pagerBox);
		for(var i=1; i <= numPage; i++){
			var $page = $("<span/>");
			$page.text(i);
			if(i==_currPage){
				$page.addClass("selected");
			}else{
				$page.click({page:i}, function(e){
					_currPage = e.data.page;
					Render();
					changePageEvent(_currPage);
				});
			}
			$pagerBox.append($page);
		}
	}
	
	Render();
}


