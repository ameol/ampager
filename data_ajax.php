<?php 
    include("data.php");
    $index=intval($_GET["index"]);
    $size=intval($_GET["size"]);
    $name=$_GET["name"];
    $career=$_GET["career"];
    //查询
    $data=DataManager::GetData($index,$size,$name,$career);
    echo json_encode($data);
 ?>