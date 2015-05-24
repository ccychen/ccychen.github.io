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
		
		this.add = function(f, c, tUrl){
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
			
			row.add(_data[i][0],	//folder 
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
		target_row_height: 300,
		margin: 12,	//for calculation, also define in css
		rows_per_page: 3,
		image_folder:"works\\sketch\\"
	}
	var _imageFileNames = images;
	var _image_thumb_folder = _config["image_folder"] + "thumb\\thumb_";
	var _tarRowWidth = _config["width"];
	var _tarRowHeight = _config["target_row_height"];
	var _margin = _config["margin"];
	var _$album = album;
	
	//init
	_$album.width(_tarRowWidth);
	
	this.Render = function(){
		var len = _imageFileNames.length;
		var $row = $("<div/>");
		var rowWidth = 0;
		var numRowImgs = 0;
		
		for(var i=0; i<len; i++){
			var $img = $("<img/>").attr("src", _image_thumb_folder + _imageFileNames[i])
			.load(function(){	
				var nextWidth = Math.ceil(this.width / (this.height / _tarRowHeight));
		
				if((rowWidth + nextWidth + _margin * numRowImgs < _tarRowWidth) || //the next image is narrow than space
				   (_tarRowWidth - rowWidth - _margin * numRowImgs > (nextWidth + _margin)/2)){ //space > image width / 2
					//append
					$row.append($(this));
					numRowImgs ++;
					rowWidth += nextWidth;
					
				}else{
					//display row
					var ratio = (_tarRowWidth - _margin * numRowImgs) / rowWidth;
					var rowHeight = Math.round(_tarRowHeight * ratio);
					
					//$row.children().height(rowHeight);
					$row.height(rowHeight).addClass("row");
					_$album.append($row);
					
					//new row
					$row = $("<div/>");
					rowWidth  = 0;
					numRowImgs = 0;
				}
			});
		}
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


