/**
 * Created by quanquan.sun on 2017/4/20 0020.
 */
var http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy');

var ep = new eventproxy(),
    urlsArray = [],	//存放爬取网址
    pageUrls = [],	//存放收集文章页面网站
    pageNum = 200;	//要爬取文章的页数

////http://zhidao.baidu.com/usercenter?uid=0e2d4069236f25705e792031

pageUrls.push("http://blog.csdn.net/web/index.html");

function start(){
    function onRequest(req,res){
        pageUrls.forEach(function(url,index){
            console.log(index);
            superagent.get(url).end(function(err,pres){
                if(err) console.log(err);
                var $ = cheerio.load(pres.text);
                var url1 = $('a');
                for(var i=0;i<url1.length;i++){
                    var articleUrl = url1.eq(i).attr('href');
                    urlsArray.push(articleUrl);
                }
                if(index == pageUrls.length-1){
                    console.log(urlsArray.length);
                    var res = [];
                    var json = {};
                    for(var i = 0; i < urlsArray.length; i++){
                        if(!json[urlsArray[i]]){
                            res.push(urlsArray[i]);
                            json[urlsArray[i]] = 1;
                        }
                    }
                    console.log(res.length);
                    for(var i=0;i<res.length;i++) {
                        res.write('1、爬虫结果：' + res[i] + '<br/>');
                    }
                }
            })
        });
    }
    http.createServer(onRequest).listen(3001);
}
exports.start= start;