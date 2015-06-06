//pager
function Pager(pager, numPage, changePageEvent) {
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {

    var $paint = $("#navigator").children(".painting");
    $paint.mouseover(function () {
        $paint.html("COMEING SOON");
    });

    $paint.mouseout(function () {
        $paint.html("PAINTING");
    });
});