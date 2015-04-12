/*
 *  ampager by ameol
 *  2013.4.14第一版,2015.4修改一些bug,完善了一些功能
 *  一款简单的分页插件，支持三种分页方式，数据一次性读取分页，url跳转分页，ajax分页
 *  插件通过js来实现分页。不是用于分页容器，而是用于内容容器。$('#content').ampager();
    分为三种分页方式，第一种静态方式分页（mode:"static"），主要是一次性读取数据后的数据分页。
    第二种url分页（mode:"url"），传入每页显示几条和数据总数就行，它会在url地址中分配一个名为p参数(可以修改名称)，用于指定当前页。
    第二种ajax分页（mode:"ajax"），通过ajax请求数据分页，可以通过传入一个callback函数，来执行后续操作。例如：
    'callback': function (e, index, viewCount) {  
    		//分别代表e：数据父容器（直接父容器），index：当前页，viewCount：每页显示多少条数据
            $.getJSON('path', { "index": index, "count": viewCount }, function (data) {
                e.html('');     //先清空遗留数据
                for (var i = 0; i < data.length; i++) {
                    e.append("<li>" + data[i] + "......</li>");
                }
            });
        }
 */
;(function ( $, window, document, undefined ) {
    "use strict";
    // Create the defaults once
    var pluginName = 'ampager',
        defaults = {
            pagerName: 'pager',			//分页的容器（默认为pager）
			viewCount: 5,				//可显示多少条数据
			dataCount: 0,				//如果后台取数据，总数多少（静态分页不用）
			selectClass: 'selectno',	//选中的样式
			listCount:10,				//显示多少个分页码（不包括前一页，后一页）
			enablePrevNext:true,		//允许显示前一页后一页
			enableFirst:true,			//允许只有一页的情况下显示页码
			template:'default',			//模板（现只有一个，default）			
            needNumInput:false,         //是否需要输入框
			mode:'static',				//可选参数 "static","url","ajax"，静态分页，url传参分页，ajax分页
            urlPageParmName:'p',        //url分页页码参数名，默认为p
			urlParameter:'',		    //url参数,不用写页码参数！比如查询条件，写类似于aa=1&bb=2...
			callback:null			    //回调函数（ajax取数据或者静态也可以使用）
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._name = pluginName;
        this.init();
    }
	//获取url参数
	var getQueryString = function (name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return undefined;
	};
	//静态模板数据展示
	var Bind_StaticData = function ($content, minnum, maxnum) {
		if (minnum > 0) {
			$content.children(':gt(' + (minnum - 1) + '):lt(' + maxnum + ')').css('display', '');//chrome下使用block布局错乱，因此使用空
		} else {
			$content.children(':lt(' + maxnum + ')').css('display', '');
		}
		$content.children(':lt(' + (minnum) + ')').css('display', 'none');
		$content.children(':gt(' + (maxnum - 1) + ')').css('display', 'none');	
	};
    //生成url
	var createUrl=function(up,pn,pageNo){
	    return location.pathname + '?' + up + '&' + pn + '=' + pageNo;
	};
	//格式化成a元素
	var FormatStr = function (pageNo, pageText) {
	    var href = this.options.mode == 'url' ? createUrl(this.options.urlParameter,this.options.urlPageParmName,pageNo) : 'javascript:;';
	    return '<a href="' + href + '" data-i="' + pageNo + '">' + pageText + '</a>';
	};
	//选中状态a元素
	var FormatStrIndex = function(pageNo){
	    return '<span class="' + this.options.selectClass + '">' + pageNo + '</span>';
	};
    //获取正确的页码
	var getValidNum = function (numval,totalpage) {
	    return isNaN(numval) || numval < 1 ? 1 : (numval > totalpage ? totalpage : numval);
	};
    //获取输入框值
	var getInputNum = function (totalpage) {
	    var numval = parseFloat($('#pager_num_input').val());
	    return getValidNum(numval, totalpage);
	};
	//private
	//分页主要行为逻辑部分
	//默认模板初始化页码集合
	var	InitDefaultList = function(_pageIndex,pageCount){
		if(this.options.listCount<5)
				throw new Error('listCount must be lager than 5');	//listCount>5
		var pageIndex = parseFloat(_pageIndex);		//转化为number
		var ns = [];
		var numList = new Array(this.options.listCount);	
		if (pageIndex >= this.options.listCount) {   
			numList[0] = 1;
			numList[1] = '…';	
			var infront = 0;
			var inback = 0;
			var inflag = Math.floor((this.options.listCount-2)/2);
			if(this.options.listCount%2==0){
				infront = inflag-1;
				inback = inflag;
			}else{
				infront = inflag;
				inback = inflag;
			}
			if (pageIndex + inback >= pageCount) {                
				for (var i = pageCount - (this.options.listCount-3); i < pageCount + 1; i++) {
					ns.push(i);
				}
				for (var j = 0; j <= (this.options.listCount-3); j++) {  
					numList[j + 2] = ns[j];
				}
			}
			for (var i = pageIndex - infront; i <= pageIndex + inback; i++) {
				ns.push(i);
			}
			for (var j = 0; j < (this.options.listCount-2); j++) {
				numList[j + 2] = ns[j];
			}
		} else {              
			if (pageCount >= this.options.listCount) {                               
				for (var i = 0; i < this.options.listCount; i++) {
					numList[i] = i+1;
				}
			} else {                        
				for (var i = 0; i < pageCount; i++) {
					numList[i] = i+1;
				}
			}
		}
		return numList;
	};
	//生成页码
	var InitPager = function (pageIndex, pageCount) {
		$('#'+this.options.pagerName).html('');
		if(!this.options.enableFirst&&pageCount<=1){
			return null;
		}
		var array = [];
		var $con = $('#'+this.options.pagerName);
		switch(this.options.template){	//选择模板
			case 'default':array = InitDefaultList.call(this,pageIndex,pageCount);break;
			default:array = InitDefaultList.call(this,pageIndex,pageCount);
		}
		var arr_len = array.length;
		if(!array instanceof Array){
			throw new Error('is not array');
		} 
		if(arr_len!=this.options.listCount){
			throw new Error('array.length error:'+arr_len);
		}
		if(this.options.enablePrevNext){
			if(pageIndex==1)
				$con.append('<a href="javascript:;" data-i="0">上一页</a>');
			else
				$con.append(FormatStr.call(this,pageIndex-1,'上一页'));      
		}	
		for(var i=0;i<arr_len;i++){
			if(typeof array[i]=='undefined'){
				continue;
			}
			if(pageIndex==array[i]){
				$con.append(FormatStrIndex.call(this,array[i]));
			}else if(typeof array[i]=='number'){
			    $con.append(FormatStr.call(this, array[i], array[i]));
			}else{
				$con.append(array[i]);
			}
		}
		if (this.options.needNumInput) {
		    $con.append('<input type="text" id="pager_num_input" class="numinput"/><button id="pager_num_btn" class="numbutton">确定</button>');
		}
		if (this.options.enablePrevNext) {
			if(pageIndex==pageCount)
				$con.append('<a href="javascript:;" data-i="0">下一页</a>');
			else
		    	$con.append(FormatStr.call(this, pageIndex + 1, '下一页'));
		}
	};
    Plugin.prototype = {
		//初始化
        init: function () {
            var that = this;
            var options = that.options;
            var $thisbase = $(that.element);
			var $content;
			if ($thisbase.is(':has(tbody)')) {
			    $content = $thisbase.children('tbody');
			}
			else{
				$content=$thisbase;
			}	
			var count = options.mode=='static'?$content.children().length:options.dataCount;		
			var eachcount = options.viewCount;				
			var totalpage = Math.ceil(count / eachcount); 
			var $pager = $('#' + options.pagerName);
			var indexnum = 1;
			if(options.mode=='url'){
			    var urlindex = getValidNum(parseFloat(getQueryString(options.urlPageParmName)),totalpage);
                InitPager.call(that, urlindex, totalpage);
				if (options.needNumInput) {
				    $('#pager_num_btn').on('click', function () {
				        window.location.href = createUrl(options.urlParameter, options.urlPageParmName, getInputNum(totalpage));
				    });
				}
			} else {
			    InitPager.call(that, 1, totalpage);
				if(options.mode=='static'&&typeof options.callback!='function'){
					Bind_StaticData($content,0,eachcount);
				}else{
					options.callback($content,1,options.viewCount);
				}
				$pager.unbind('click');
				$pager.on('click', function (e) {		//click事件
				    if(e.target.tagName!='A'&&e.target.tagName!='BUTTON') return false;
				    var $this = $(e.target);
				    var indexnum;
				    if ($this.attr('id') == 'pager_num_btn') {
				        indexnum = getInputNum(totalpage);
				    }else{
				        $this.removeAttr('href').siblings().attr('href', 'javascript:;');//..
				        var thisnum = parseFloat($this.data('i')); 
				        if (typeof thisnum === 'number' && thisnum > 0 && thisnum <= totalpage) {
				            indexnum = thisnum;
				        } else {
				            return false;
				        }
				    }
					var maxnum = (indexnum * eachcount);
					var minnum = (indexnum - 1) * eachcount;
					if(options.mode!='static'&&options.mode!='ajax'){
						throw new Error('mode must be selected:static,url,ajax');
					}
					if(options.mode=='static'&&typeof options.callback!='function'){
					    InitPager.call(that, indexnum, totalpage);
						Bind_StaticData($content,minnum, maxnum);
					} else {
					    InitPager.call(that, indexnum, totalpage);
						options.callback($content,indexnum,options.viewCount);
					}
				});
			}
        }
    };
    
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        });
    };
})( jQuery, window, document );
