/**
 * Created by quanquan.sun on 2017/6/14.
 */
var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res) {

    var href = [];
    var pageHref = [];
    request('http://list.iqiyi.com/www/1/-------------11-1-1-iqiyi--.html', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var waiDiv = $('.site-piclist_pic');
            var pages = $('.mod-page')[0].children;
            for(var i=0;i<waiDiv.length;i++){
                href.push({
                    href:(waiDiv[i].children)[0].next.attribs.href,
                    title:(waiDiv[i].children)[0].next.attribs.title
                });
            }
            for(var i=0;i<pages.length;i++){
                if(pages[i].name == 'a'){
                    pageHref.push(pages[i].attribs.href);
                }
            }
            pageHref.forEach(function(item,index){
                item = 'http://list.iqiyi.com'+item;
                request(item, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        var waiDivPage = $('.site-piclist_pic');
                        for (var i = 0; i < waiDivPage.length; i++) {
                            href.push({
                                href:(waiDivPage[i].children)[0].next.attribs.href,
                                title:(waiDivPage[i].children)[0].next.attribs.title
                            });
                        }
                        if(index == pageHref.length-1) {
                            function a(arr) {
                                var unique = {};
                                arr.forEach(function (a) {
                                    unique[JSON.stringify(a)] = 1
                                });
                                arr = Object.keys(unique).map(function (u) {
                                    return JSON.parse(u)
                                });
                                return arr;
                            }
                            href = a(href);
                            res.json(href);
                        }
                    }
                })
            });
        }
    })
});

var server = app.listen(3000, function() {
    console.log('listening at 3000');
});