<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>StaticPager</title>
    <link href="css/plugins.css" rel="stylesheet" />
</head>
<body>
<h3>静态分页</h3>
    <div id="static_content">
    <?php 
        include("data.php");
        $data=DataManager::GetData();
        $arr=$data["list"];
        $totalCount=$data["totalCount"];
        foreach ($arr as $key => $value) {
             echo "<p>".$value->name."---".$value->age."---".$value->career."</p>";
         } 
     ?>
     </div>
    <div id="static_pager" class="pager"></div>
    <script src="js/jquery-1.9.0.js"></script>
    <script src="js/ampager.js"></script>
    <script type="text/javascript">
        (function() {
            $('#static_content').ampager({
                'pagerName': 'static_pager',
                'mode': 'static',
                'needNumInput': true,
                'dataCount': <?php echo $GLOBALS['totalCount']; ?>, //后台获取总条数
                'viewCount': 5, //配置每页显示
                'listCount': 7
            });
        })();
    </script>
</body>
</html>