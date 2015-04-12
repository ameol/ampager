# ampager
一款简单的分页插件，支持三种分页方式，数据一次性读取分页，url跳转分页，ajax分页
使用方法
引入jquery.js和ampager.js
例如：
<div id="datacontainer"></div>
<div id="pager"></div>
<script type="text/javascript">
    (function() {
        $('#datacontainer').AmPager({
            'pagerName': 'pager',
            'mode': 'static',
            'needNumInput': true,
            'dataCount': 20, //数据总条数（静态分页不需要配置）
            'viewCount': 5, //配置每页显示
            'listCount': 7
        });
    })();
</script>

具体看代码实例，staticpager.php是第一种数据一次性读取分页（静态分页），
urlpager.php是第二种url跳转分页，
ajaxpager.html是第三种ajax分页