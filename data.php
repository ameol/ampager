<?php 
class User{
    public $name;
    public $age;
    public $career;
    public function __construct($name,$age,$career){
        $this->name = $name;
        $this->age = $age;
        $this->career = $career;
    }
}
class DataManager{
    public static function GetData($index=0,$size=5,$name='',$career=''){
        $arr[0]=new User("张三",22,"厨师");
        $arr[1]=new User("李四",23,"厨师");
        $arr[2]=new User("王五",24,"厨师");
        $arr[3]=new User("赵六",24,"厨师");
        $arr[4]=new User("老王",32,"挖掘机操作");
        $arr[5]=new User("老张",32,"挖掘机操作");
        $arr[6]=new User("老李",32,"挖掘机操作");
        $arr[7]=new User("老江",35,"挖掘机操作");
        $arr[8]=new User("老孙",26,"挖掘机操作");
        $arr[9]=new User("张1",22,"厨师");
        $arr[10]=new User("张2",22,"厨师");
        $arr[11]=new User("张3",22,"厨师");
        $arr[12]=new User("张4",22,"厨师");
        $arr[13]=new User("张5",22,"厨师");
        $arr[14]=new User("张6",22,"厨师");
        $arr[15]=new User("张7",22,"厨师");
        $arr[16]=new User("张8",22,"厨师");
        $arr[17]=new User("张9",22,"厨师");
        $arr[18]=new User("张10",22,"厨师");

        $data["totalCount"]=sizeof($arr);
        $data["list"]=$arr;
        //查询
        if(!empty($name)){
        $arr=array_filter($arr,function($item){
             if($item->name==$GLOBALS['name']){
                    return true;
                }
                return false;
        });
        }
        if(!empty($career)){
            $arr=array_filter($arr,function($item){
                if($item->career==$GLOBALS['career']){
                    return true;
                }
                return false;
            });
        }
        if($index==0){
            return $data;
        }
        $start=($index - 1)*$size;
        $end=$size;
        $data["totalCount"]=sizeof($arr);
        $data["list"]=array_slice($arr, $start,$end);
        return $data;    
    }
}
 ?>