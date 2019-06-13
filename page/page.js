function Paging(paramsObj, callback) {
    var that = this;
    this.pageSize = paramsObj.pageSize || 10;    //每页条数（不设置时，默认为10
    this.pageIndex = paramsObj.pageIndex || 1;    //当前页码
    this.totalCount = paramsObj.totalCount || 0;   //总记录数
    this.totalPage = Math.ceil(paramsObj.totalCount / paramsObj.pageSize) || 0;     //总页数

    this.prevPage = paramsObj.prevPage || '<';                //上一页（不设置时，默认为：<）
    this.nextPage = paramsObj.nextPage || '>';                //下一页（不设置时，默认为：>）
    this.firstPage = paramsObj.firstPage || '<<';             //首页（不设置时，默认为：<<）
    this.lastPage = paramsObj.lastPage || '>>';               //末页（不设置时，默认为：>>）

    this.selectPageSize = paramsObj.selectPageSize || false;  // 是否显示选择分页
    this.degeCount = paramsObj.degeCount || 2;                //当前页前后两边可显示的页码个数（不设置时，默认为2）
    this.ellipsis = paramsObj.ellipsis;                       //是否显示省略号不可点击按钮（true：显示，false：不显示）
    this.ellipsisBtn = (paramsObj.ellipsis === true || paramsObj.ellipsis === null) ? '<li><span class="ellipsis">…</span></li>' : '';


    function applyStyle() {
        var pageStyle = "#my-page {font-size: 14px;background-color: transparent;width: 100%;height: 50px;line-height: 50px;display: block;}" +
            "#my-page .page-l {float: right;}" +
            "#my-page .page-l select {width: 60px;height: 30px;}" +
            "#my-page .page-l .page-size-box {display: inline-block;margin-left: 20px;}" +
            "#my-page .page-r {float: right;padding-top: 10px;}" +
            "#my-page .page-r ul {float: left;list-style: none;margin: 0;height: 30px;box-sizing: border-box;padding: 0;}" +
            "#my-page .page-r ul li {float: left;list-style: none;height: 100%;line-height: 30px;border: 1px solid #ccc;border-right: 0 none;box-sizing: border-box;}" +
            "#my-page .page-r ul li a:hover {background-color: #f5f2f2;}" +
            "#my-page .page-r ul li:last-child {border-right: 1px solid #ccc;}" +
            "#my-page .page-r ul li a {text-decoration: none;display: block;height: 100%;padding:0 10px; color: #777;}" +
            "#my-page .page-r ul li a.active {background-color: #09aeb0;color: #fff;}" +
            "#my-page .page-r ul li span {display: block;height: 100%;padding:0 10px;color: #ccc;cursor: not-allowed;}" +
            "#my-page .page-r ul li span.ellipsis {cursor: default;}";
        var styleNode = document.createElement('style');
        styleNode.innerHTML = pageStyle;
        document.getElementsByTagName('head')[0].appendChild(styleNode);
    }

    applyStyle();

    this.selectPageSizeHtml = '<div class="page-size-box">\
                                    <span>每页显示</span>\
                                    <select id="page_size">\
                                        <option value="10">10</option><option value="20">15</option>\
                                        <option value="50">30</option><option value="100">50</option>\
                                    </select>条\
                                </div>';

    if (this.selectPageSize) {
        document.getElementById("page_l").innerHTML += this.selectPageSizeHtml;
        document.getElementById("page_size").value = this.pageSize;    // 设置默认值
        document.getElementById("page_size").onchange = function () {  // 改变每页条数
            that.pageIndex = paramsObj.pageIndex = 1;
            that.pageSize = paramsObj.pageSize = this.value - 0;
            callback && callback(that.pageIndex, that.pageSize);
        };
    }

    // 生成分页DOM结构
    this.initPage = function (totalCount, totalPage, pageIndex) {
        this.totalCount = totalCount;
        this.totalPage = totalPage;
        this.pageIndex = pageIndex;
        var degeCount = this.degeCount;
        var pageHtml = '';  //总的DOM结构
        var tmpHtmlPrev = '';   //省略号按钮前面的DOM
        var tmpHtmlNext = '';   //省略号按钮后面的DOM
        var headHtml = ''; //首页和上一页按钮的DOM
        var endHtml = '';   //末页和下一页按钮的DOM
        var count = degeCount;
        var countNext = 0;
        var countPrev = 0;
        if (pageIndex - degeCount >= degeCount - 1 && totalPage - pageIndex >= degeCount + 1) {
            //前后都需要省略号按钮
            console.log("前后都需要省略号按钮");
            headHtml = '<li><a id="first_page" href="javascript:;">' + this.firstPage + '</a></li>' +
                '<li><a id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';

            endHtml = '<li><a id="next_page" href="javascript:;">' + this.nextPage + '</a></li>' +
                '<li><a id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

            count = degeCount;  //前后各自需要显示的页码个数
            for (var i = 0; i < count; i++) {
                if (pageIndex !== 1) {
                    tmpHtmlPrev += '<li><a href="javascript:;" class="page-number">' + (pageIndex - (count - i)) + '</a></li>';
                }
                tmpHtmlNext += '<li><a href="javascript:;" class="page-number">' + ((pageIndex - 0) + i + 1) + '</a></li>';
            }
            pageHtml = headHtml + this.ellipsisBtn + tmpHtmlPrev +
                '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' +
                tmpHtmlNext + this.ellipsisBtn + endHtml;
        } else if (pageIndex - degeCount >= degeCount - 1 && totalPage - pageIndex < degeCount + 1) {
            //前面需要省略号按钮，后面不需要
            console.log("前面需要省略号按钮，后面不需要");
            headHtml = '<li><a id="first_page" href="javascript:;">' + this.firstPage + '</a></li>' +
                '<li><a id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';

            if (pageIndex === totalPage) { //如果当前页就是最后一页
                endHtml = '<li><span id="next_page" href="javascript:;">' + this.nextPage + '</span></li>' +
                    '<li><span id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
            } else {  //当前页不是最后一页
                endHtml = '<li><a id="next_page" href="javascript:;">' + this.nextPage + '</a></li>' +
                    '<li><a id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';
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
            pageHtml = headHtml +
                this.ellipsisBtn +
                tmpHtmlPrev +
                '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' +
                tmpHtmlNext +
                endHtml;
        } else if (pageIndex - degeCount < degeCount - 1 && totalPage - pageIndex >= degeCount + 1) {
            //前面不需要，后面需要省略号按钮
            console.log("前面不需要，后面需要省略号按钮");
            if (pageIndex === 1) { //如果当前页就是第一页
                headHtml = '<li><span id="first_page" href="javascript:;">' + this.firstPage + '</span></li>' +
                    '<li><span id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
            } else {  //当前页不是第一页
                headHtml = '<li><a id="first_page" href="javascript:;">' + this.firstPage + '</a></li>' +
                    '<li><a id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
            }

            endHtml = '<li><a id="next_page" href="javascript:;">' + this.nextPage + '</a></li>' +
                '<li><a id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

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
            pageHtml = headHtml +
                tmpHtmlPrev +
                '<li><a href="javascript:;" class="active">' + pageIndex + '</a></li>' +
                tmpHtmlNext +
                this.ellipsisBtn +
                endHtml;
        } else if (pageIndex - degeCount < degeCount - 1 && totalPage - pageIndex < degeCount + 1) {
            console.log("前后都不需要省略号按钮");
            //前后都不需要省略号按钮
            headHtml = '<li><a id="first_page" href="javascript:;">' + this.firstPage + '</a></li>' +
                '<li><a id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
            endHtml = '<li><a id="next_page" href="javascript:;">' + this.nextPage + '</a></li>' +
                '<li><a id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';

            if (totalPage === 1) { //如果总页数就为1
                headHtml = '<li><span id="first_page" href="javascript:;">' + this.firstPage + '</span></li>' +
                    '<li><span id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
                endHtml = '<li><span id="next_page" href="javascript:;">' + this.nextPage + '</span></li>' +
                    '<li><span id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
            } else {
                if (pageIndex === 1) { //如果当前页就是第一页
                    headHtml = '<li><span id="first_page" href="javascript:;">' + this.firstPage + '</span></li>' +
                        '<li><span id="prev_page" href="javascript:;">' + this.prevPage + '</span></li>';
                    endHtml = '<li><a id="next_page" href="javascript:;">' + this.nextPage + '</a></li>' +
                        '<li><a id="last_page" href="javascript:;">' + this.lastPage + '</a></li>';
                } else if (pageIndex === totalPage) {  //如果当前页是最后一页
                    headHtml = '<li><a id="first_page" href="javascript:;">' + this.firstPage + '</a></li>' +
                        '<li><a id="prev_page" href="javascript:;">' + this.prevPage + '</a></li>';
                    endHtml = '<li><span id="next_page" href="javascript:;">' + this.nextPage + '</span></li>' +
                        '<li><span id="last_page" href="javascript:;">' + this.lastPage + '</span></li>';
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
        document.getElementById("page_ul").innerHTML = pageHtml;
        document.getElementById("total_count").innerHTML = totalCount;

        // 点击页码（首页、上一页、下一页、末页、数字页）
        document.getElementById("page_ul").onclick = function (e) {
            var el = (e || window.event).target;
            if (el.tagName.toLowerCase() === "a") {
                var id = el.id, className = el.className;
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
                console.log(that.pageIndex,"---------",typeof that.pageIndex);
                callback && callback(that.pageIndex, that.pageSize);
            }
        };
    };
}