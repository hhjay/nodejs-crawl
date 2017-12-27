var http = require("http"), cheerio = require("cheerio"), 
    superagent = require("superagent"), iconv = require("iconv-lite"),
    jieba = require(“”);

// http.createServer((req, res)=>{
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('This System Is End');
// }).listen(3000)
// console.log("server is run in :3000");

let root = "http://www.dy2018.com";

function loadPage(url) {
    http.get(url, function (sres) {
        var chunks = [], ret = [];
        sres.on('data', function (chunk) {
            chunks.push(chunk);
        });
        sres.on('end', function () {
            var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
            var $ = cheerio.load(html, { decodeEntities: false });
            let urls = $(".co_area2");
            urls.each(function (i, item) {
                let aurl = $(item).find("a");

                aurl.each(function (j, item2) {
                    let temp = $(item2).attr("href");
                    ret.push({
                        url: url + temp,
                        name: $(item2).text()
                    })

                    if (temp.indexOf("/i/") >= 0 ) {
                        loadBt(url + temp);
                    }
                })
            })

            // console.log(ret);
        });
    });
}

function loadBt(url) {
    http.get(url, function (sres) {
        var chunks = [], ret = [];
        sres.on('data', function (chunk) {
            chunks.push(chunk);
        });
        sres.on('end', function () {
            var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
            var $ = cheerio.load(html, { decodeEntities: false });
            let urls = $(".co_content8 table a");
            
            console.log(url, urls.length);
            
            urls.each(function (i, item) {
                // console.log($(item).attr("href"));
            })
        });

    });
}

loadPage(root);