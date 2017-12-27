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
    let ret = {}, sw = segment.doSegment(word, {
        simple: true, stripPunctuation: true, convertSynonym: true
    });
    sw.forEach(key => {
        if ( !ret[key] ) {
            ret[key] = 1;
        }else{
            ret[key]++;
        }
    });
    return ret;
}

// let sp = splitWord("习近平");
let sp = splitWord("习近平指出，我们党是生于忧患、成长于忧患、壮大于忧患的政党。正是一代代中国共产党人心存忧患、肩扛重担，才团结带领中国人民不断从胜利走向新的胜利。我国形势总的是好的，但我们前进道路上面临的困难和风险也不少。国内外环境发生了深刻变化，面对的矛盾和问题发生了深刻变化，发展阶段和发展任务发生了深刻变化，工作对象和工作条件发生了深刻变化，对我们党长期执政能力和领导水平的要求也发生了深刻变化。中央政治局的同志尤其要增强忧患意识、居安思危，时刻准备进行具有许多新的历史特点的伟大斗争，知危图安，尽职尽责、勇于担责，着力破解突出矛盾和问题，有效防范化解各种风险。")

console.log(sp);