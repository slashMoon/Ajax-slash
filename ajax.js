/**
 * 封装一个ajax工具函数
 */

/**
 * 封装步骤:
 * 1.分析参数（提取会变的为参数）
 * 
 * 参数               参数名         类型          默认值                   取值
 * 请求方式           type          字符串         get                     get,post  
 * 请求地址           url           字符串         location.pathname      请求的后台文件地址
 * 是否异步           async         布尔值         true                    true,false
 * 传递数据           data          对象           {}                     {name:jack,age:18}   ===> name=jack&age=18
 * 
 * 
 * 成功回调函数       success         函数           -                      成功获取数据回来后如何处理(调用这个函数)
 * 失败回调函数       error           函数           -                      数据获取失败后如何处理
 */






/*4.利用命名空间处理代码冲突*/

/**
 *  slashMoon.ajax(参数)
 *  slashMoon.get();
 *  slashMoon.post()
 */

window.slashMoon = {
  
    ajax:function(options){
        /*1.检查参数*/
        if(!options || typeof options !== "object"){
            console.log('参数不合法')
            return false;
        }

        /*2.处理默认参数*/
        /*请求方式:如传的是post则,type赋值为post,否则赋值为get*/
        var type = options.type == 'post' ? 'post': 'get';
        /*请求地址:用户没有传则用location.pathname地址*/
        var url = options.url || location.pathname;
        /*同步异步: 一定要传布尔值false才能发送同步请求*/
        var async = options.async === false ? false : true;
        /*传递的数据:没传就给一个空对象*/
        var data = options.data || {};


        /*3.保存数据转换后的字符串*/
        var dataStr = "";
        for(var key in data ){
           
            dataStr +=  key + "=" + data[key] + "&"
        }
        dataStr = dataStr.slice(0,-1);
        //console.log(dataStr);

        
        /*处理get请求和post请求差异*/
        var xhr = new XMLHttpRequest();

        /*发请求报文*/
        if(type === 'get'){
            xhr.open(type,url + "?" + dataStr);
            xhr.send(null);
        } else {
            xhr.open(type,url);
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            xhr.send(dataStr);
        }


        /*监听请求响应的过程,获取数据*/
        xhr.onreadystatechange = function(){
            /*请求完成*/
            if(xhr.readyState == 4){

                /*请求成功*/
                if(xhr.status == 200){
                    /*接收数据*/
                    //xhr.responseText; xhr.responseXML;

                    /*  Content-Type:application/xml;charset=utf-8  */
                    /*  Content-Type:application/json;charset=utf-8  */

                    var contentType = xhr.getResponseHeader('content-type');
                    var result = null;
                
                    if( contentType.indexOf('xml') > -1 ){
                        /*如果返回的是xml*/
                        result =  xhr.responseXML;
                    } else if( contentType.indexOf('json') > -1 ){
                        /*如果json字符串,就将json字符串转成js对象*/
                        result =  JSON.parse( xhr.responseText);
                    } else {
                        /*普通字符串*/
                        result =  xhr.responseText;
                    }
                    
                    /*直接调用会出错  options.success(result);  */
                    /*如果传递了success函数参数,则调用该函数*/
                    options.success &&  options.success(result);


                } else {
                    options.error &&  options.error(xhr.status,xhr.statusText);
                }
            }
        }


    }
}


