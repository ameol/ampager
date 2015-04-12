<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>UrlPager</title>
    <link href="css/plugins.css" rel="stylesheet" />
</head>
<body>
    <h3>普通url分页</h3>
    <h3>搜索条件</h3>
    <div>
        <div>姓名：<input type="text" id="txt_name" /></div>
        <div>职业：<input type="text" id="txt_career" /></div>
        <button id="btn_ok">查询</button>
    </div>
    <div id="url_content">
    <?php 
        include("data.php");
        $index=intval(empty($_GET["index"])?1:$_GET["index"]);
        $size=intval(empty($_GET["size"])?5:$_GET["size"]);
        $name=empty($_GET["name"])?"":$_GET["name"];
        $career=empty($_GET["career"])?"":$_GET["career"];
        $searchParms="name=".$name."&career=".$career;
        $data=DataManager::GetData($index,$size,$name,$career);
        $arr=$data["list"];
        foreach ($arr as $key => $value) {
             echo "<p>".$value->name."---".$value->age."---".$value->career."</p>";
         } 
         $totalCount=$data["totalCount"];
     ?>
     </div>
    <div id="url_pager" class="pager"></div>

    <script src="js/jquery-1.9.0.js"></script>
    <script src="js/AmPager.js"></script>
    <script type="text/javascript">
        (function() {
            $('#url_content').AmPager({
                'pagerName': 'url_pager',
                'mode': 'url',
                'needNumInput': true,
                'dataCount': <?php echo $GLOBALS['totalCount']; ?>, //后台获取总条数
                'viewCount': 5, //配置每页显示
                'listCount': 7,
                'urlPageParmName':'index',//页码名称
                'urlParameter': '<?php echo $GLOBALS['searchParms']; ?>',//查询参数
            });

            $('#btn_ok').click(function(){
                var par_name = $('#txt_name').val(); //查询条件
                var par_career = $('#txt_career').val(); //查询条件
                window.location.href = '/urlpager.php?name=' + par_name + '&career=' + par_career;
            });
        })();
    </script>
</body>
</html>