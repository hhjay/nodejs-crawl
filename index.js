var http = require("http"), cheerio = require("cheerio"), 
    superagent = require("superagent"), iconv = require("iconv-lite"),
    Segment = require("segment");// 分词

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
// loadPage(root);


function splitWord(word) {
    let segment = new Segment();
    segment.useDefault();

    segment.use('URLTokenizer');
    segment.loadDict('./asset/names.txt');
    // return segment.doSegment(word);
    let obj = {}, ret = [], sw = segment.doSegment(word, {
        simple: true, stripPunctuation: true, convertSynonym: true
    });

    sw.forEach(key => {
        if ( !obj[key] ) {
            obj[key] = 1;
        }else{
            obj[key]++;
        }
    });

    for(let i in obj) {
        ret.push({ key: i, val: obj[i] });
    }
    
    return ret.sort(desSort);
}
function desSort(obj1, obj2) {
    if (obj1.val > obj2.val) {
        return -1;
    }
    if (obj1.val < obj2.val) {
        return 1;
    }

    return 0;
}
function loadText(url, dom){
    return new Promise((reslove, reject)=>{
        http.get(url, function (sres) {
            var chunks = [], ret = [];
            sres.on('data', function (chunk) { chunks.push(chunk); });
            sres.on('end', function () {
                var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
                var $ = cheerio.load(html, { decodeEntities: false });
                
                let text = $(dom).text();
                reslove( text.replace(/\s+/g, "") );
            });
        });
    })
}

let text = loadText("http://news.163.com/17/1226/22/D6K6SJ36000189FH.html", "#endText");
text.then(res=>{
    console.log(splitWord(res));
})