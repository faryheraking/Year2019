function Pagination(paramsObj, callback) {
    var that = this;
    this.container = paramsObj.container;
    this.mainHtml = '<div class="my-page">' +
        '<div class="page-r"><ul class="page-ul"></ul></div>' +
        '<div class="page-l">' +
        '<p>总共 <span class="total-count">0</span> 条，<span class="total-pages"></span> 页，当前第 <span class="current-page">1</span> 页</p>' +
        '</div>' +
        '</div>';
    this.container.innerHTML = this.mainHtml;

    this.pageSize = paramsObj.pageSize || 10;    //每页条数（不设置时，默认为10
    this.pageIndex = paramsObj.pageIndex || 1;    //当前页码
    this.totalCount = paramsObj.totalCount || 0;   //总记录数

    this.prevPage = paramsObj.prevPage || '<';                //上一页（不设置时，默认为：<）
    this.nextPage = paramsObj.nextPage || '>';                //下一页（不设置时，默认为：>）
    this.firstPage = paramsObj.firstPage || '<<';             //首页（不设置时，默认为：<<）
    this.lastPage = paramsObj.lastPage || '>>';               //末页（不设置时，默认为：>>）

    this.selectPageSize = paramsObj.selectPageSize || false;  // 是否显示选择分页
    this.degeCount = paramsObj.degeCount || 2;                //当前页前后两边可显示的页码个数（不设置时，默认为2）
    this.ellipsis = paramsObj.ellipsis;                       //是否显示省略号不可点击按钮（true：显示，false：不显示）
    this.ellipsisBtn = (paramsObj.ellipsis === true || paramsObj.ellipsis === null) ? '<li><span class="ellipsis">…</span></li>' : '';


    function applyStyle() {
        if (!document.getElementById("pagination-style")) {
            var head = document.getElementsByTagName('head')[0] || document.head;
            var pageStyle = ".my-page p{margin: 0;padding: 0;}" +
                ".my-page {font-size: 14px;background-color: transparent;width: 100%;line-height: 30px;display: block;}" +
                ".my-page .page-l {float: right;height:30px;}" +
                ".my-page .page-l select {width: 60px;height: 30px;}" +
                ".my-page .page-l .page-size-box {display: inline-block;margin-left: 20px;}" +
                ".my-page .page-r {float: right;height: 30px;margin-left: 20px;}" +
                ".my-page .page-r ul {float: left;list-style: none;margin: 0;height: 30px;box-sizing: border-box;padding: 0;}" +
                ".my-page .page-r ul li {float: left;list-style: none;height: 100%;line-height: 30px;border: 1px solid #ccc;border-right: 0 none;box-sizing: border-box;}" +
                ".my-page .page-r ul li a:hover {background-color: #f5f2f2;}" +
                ".my-page .page-r ul li:last-child {border-right: 1px solid #ccc;}" +
                ".my-page .page-r ul li a {text-decoration: none;display: block;height: 100%;padding:0 10px; color: #777;}" +
                ".my-page .page-r ul li a.active {background-color: #09aeb0;color: #fff;}" +
                ".my-page .page-r ul li span {display: block;height: 100%;padding:0 10px;color: #ccc;cursor: not-allowed;}" +
                ".my-page .page-r ul li span.ellipsis {cursor: default;}";
            var styleNode = document.createElement('style');
            styleNode.id = "pagination-style";
            styleNode.innerHTML = pageStyle;
            head.insertBefore(styleNode, head.getElementsByTagName("title")[0]);
        }
    }

    applyStyle();

    if (this.selectPageSize) {
        this.selectPageSizeHtml = '<div class="page-size-box"> ' +
            '<span>每页显示</span> ' +
            '<select class="page_size"> ' +
            '<option value="10">10</option>' +
            '<option value="20">15</option> ' +
            '<option value="50">30</option>' +
            '<option value="100">50</option> ' +
            '</select>条 ' +
            '</div>';
        this.container.getElementsByClassName("page_l")[0].innerHTML += this.selectPageSizeHtml;
        this.container.getElementsByClassName("page_size")[0].value = this.pageSize;    // 设置默认值
        this.container.getElementsByClassName("page_size")[0].onchange = function () {  // 改变每页条数
            that.pageIndex = paramsObj.pageIndex = 1;
            that.pageSize = paramsObj.pageSize = this.value - 0;
            callback && callback(that.pageIndex, that.pageSize);
        };
    }

    // 生成分页DOM结构
    this.pageCreate = function (totalCount, pageIndex) {
        this.totalCount = totalCount;
        this.pageIndex = pageIndex;
        var totalPage = this.totalPage = Math.ceil(this.totalCount / this.pageSize) || 0;
        var degeCount = this.degeCount;
        var pageHtml = '';  //总的DOM结构
        var tmpHtmlPrev = '';   //省略号按钮前面的DOM
        var tmpHtmlNext = '';   //省略号按钮后面的DOM
        var headHtml = ''; //首页和上一页按钮的DOM
        var endHtml = '';   //末页和下一页按钮的DOM
        var count = degeCount;
        var countNext = 0;
        var countPrev = 0;
        //前后都需要省略号按钮
        if (pageIndex - degeCount >= degeCount - 1 && totalPage - pageIndex >= degeCount + 1) {
            //console.log("前后都需要省略号按钮");
            headHtml = '<li><a data-id="first_page" href="javascript:;">' + this.firstPage + '</a></li><li><a data-id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
            endHtml = '<li><a data-id="next_page" href="javascript:;">' + this.nextPage + '</a></li><li><a data-id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

            count = degeCount;  //前后各自需要显示的页码个数
            for (var i = 0; i < count; i++) {
                if (pageIndex !== 1) {
                    tmpHtmlPrev += '<li><a href="javascript:;" class="page-number">' + (pageIndex - (count - i)) + '</a></li>';
                }
                tmpHtmlNext += '<li><a href="javascript:;" class="page-number">' + ((pageIndex - 0) + i + 1) + '</a></li>';
            }
            pageHtml = headHtml + this.ellipsisBtn + tmpHtmlPrev + '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' + tmpHtmlNext + this.ellipsisBtn + endHtml;
        }
        //前面需要省略号按钮，后面不需要
        else if (pageIndex - degeCount >= degeCount - 1 && totalPage - pageIndex < degeCount + 1) {
            //console.log("前面需要省略号按钮，后面不需要");
            headHtml = '<li><a data-id="first_page" href="javascript:;">' + this.firstPage + '</a></li><li><a data-id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';

            if (pageIndex === totalPage) { //如果当前页就是最后一页
                endHtml = '<li><span data-id="next_page" href="javascript:;">' + this.nextPage + '</span></li><li><span data-id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
            } else {  //当前页不是最后一页
                endHtml = '<li><a data-id="next_page" href="javascript:;">' + this.nextPage + '</a></li><li><a data-id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';
            }

            count = degeCount;  //前需要显示的页码个数
            countNext = totalPage - pageIndex;  //后需要显示的页码个数
            if (pageIndex !== 1) {
                for (var j = 0; j < count; j++) {
                    tmpHtmlPrev += '<li><a href="javascript:;" class="page-number">' + (pageIndex - (count - j)) + '</a></li>';
                }
            }
            for (var k = 0; k < countNext; k++) {
                tmpHtmlNext += '<li><a href="javascript:;" class="page-number">' + ((pageIndex - 0) + k + 1) + '</a></li>';
            }
            pageHtml = headHtml + this.ellipsisBtn + tmpHtmlPrev + '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' + tmpHtmlNext + endHtml;
        }
        //前面不需要，后面需要省略号按钮
        else if (pageIndex - degeCount < degeCount - 1 && totalPage - pageIndex >= degeCount + 1) {
            //console.log("前面不需要，后面需要省略号按钮");
            if (pageIndex === 1) { //如果当前页就是第一页
                headHtml = '<li><span data-id="first_page" href="javascript:;">' + this.firstPage + '</span></li><li><span data-id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
            } else {  //当前页不是第一页
                headHtml = '<li><a data-id="first_page" href="javascript:;">' + this.firstPage + '</a></li><li><a data-id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
            }
            endHtml = '<li><a data-id="next_page" href="javascript:;">' + this.nextPage + '</a></li><li><a data-id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

            countPrev = pageIndex - 1;  //前需要显示的页码个数
            count = degeCount;  //后需要显示的页码个数
            if (pageIndex !== 1) {
                for (var m = 0; m < countPrev; m++) {
                    tmpHtmlPrev += '<li><a href="javascript:;" class="page-number">' + (pageIndex - (countPrev - m)) + '</a></li>';
                }
            }
            for (var n = 0; n < count; n++) {
                tmpHtmlNext += '<li><a href="javascript:;" class="page-number">' + ((pageIndex - 0) + n + 1) + '</a></li>';
            }
            pageHtml = headHtml + tmpHtmlPrev + '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' + tmpHtmlNext + this.ellipsisBtn + endHtml;
        }
        //前后都不需要省略号按钮
        else if (pageIndex - degeCount < degeCount - 1 && totalPage - pageIndex < degeCount + 1) {
            //console.log("前后都不需要省略号按钮");
            headHtml = '<li><a data-id="first_page" href="javascript:;">' + this.firstPage + '</a></li><li><a data-id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
            endHtml = '<li><a data-id="next_page" href="javascript:;">' + this.nextPage + '</a></li><li><a data-id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

            if (totalPage === 1) { //如果总页数就为1
                headHtml = '<li><span data-id="first_page" href="javascript:;">' + this.firstPage + '</span></li><li><span data-id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
                endHtml = '<li><span data-id="next_page" href="javascript:;">' + this.nextPage + '</span></li><li><span data-id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
            } else {
                if (pageIndex === 1) { //如果当前页就是第一页
                    headHtml = '<li><span data-id="first_page" href="javascript:;">' + this.firstPage + '</span></li><li><span data-id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
                    endHtml = '<li><a data-id="next_page" href="javascript:;">' + this.nextPage + '</a></li><li><a data-id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';
                } else if (pageIndex === totalPage) {  //如果当前页是最后一页
                    headHtml = '<li><a data-id="first_page" href="javascript:;">' + this.firstPage + '</a></li><li><a data-id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
                    endHtml = '<li><span data-id="next_page" href="javascript:;">' + this.nextPage + '</span></li><li><span data-id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
                }
            }

            countPrev = pageIndex - 1;  //前需要显示的页码个数
            countNext = totalPage - pageIndex;  //后需要显示的页码个数
            if (pageIndex !== 1) {
                for (var p = 0; p < countPrev; p++) {
                    tmpHtmlPrev += '<li><a href="javascript:;" class="page-number">' + (pageIndex - (countPrev - p)) + '</a></li>';
                }
            }
            for (var q = 0; q < countNext; q++) {
                tmpHtmlNext += '<li><a href="javascript:;" class="page-number">' + ((pageIndex - 0) + q + 1) + '</a></li>';
            }
            pageHtml = headHtml +
                tmpHtmlPrev +
                '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' +
                tmpHtmlNext +
                endHtml;
        }

        this.container.getElementsByClassName("page-ul")[0].innerHTML = pageHtml;
        this.container.getElementsByClassName("total-count")[0].innerHTML = totalCount;
        this.container.getElementsByClassName("total-pages")[0].innerHTML = totalPage;
        this.container.getElementsByClassName("current-page")[0].innerHTML = pageIndex;

        // 点击页码（首页、上一页、下一页、末页、数字页）
        this.container.getElementsByClassName("page-ul")[0].onclick = function (e) {
            var el = (e || window.event).target;
            if (el.tagName.toLowerCase() === "a") {
                var id = el.getAttribute("data-id"), className = el.className;
                if (id === 'first_page') { //如果是点击的首页
                    that.pageIndex = 1;
                } else if (id === 'prev_page') {    //如果点击的是上一页
                    that.pageIndex = that.pageIndex === 1 ? that.pageIndex : that.pageIndex - 1;
                } else if (id === 'next_page') { //如果点击的是下一页
                    that.pageIndex = that.pageIndex === that.totalPage ? that.pageIndex : parseInt(that.pageIndex) + 1;
                } else if (id === 'last_page') { //如果点击的是末页
                    that.pageIndex = that.totalPage;
                } else if (className === 'page-number') {   //如果点击的是数字页码
                    that.pageIndex = Number(el.innerHTML);
                }
                callback && callback(that.pageIndex, that.pageSize);
            }
        };
    };
}