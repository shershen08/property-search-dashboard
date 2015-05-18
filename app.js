
/*
*********************
TO START        : 'node ./bin/www'
TO START DEBUG  : 'DEBUG=http node ./bin/www'
ALWAYS USE node-inspector : 'node-debug app.js'
*********************


*********************
INSTALLED MODULES : nodemon, debug; 
*********************
*/


var debug = require('debug')('http');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var jade = require('jade');
var path = require('path');
var randomstring = require("randomstring");
var qs = require('querystring');


var app     = express();

var dbFile = 'output.txt';

//app.set('views', '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  
  debug('/index.js :: page opened', new Date());
  
  res.render('index', { title: 'Express' });


});

/**
*
*  Index page app controller
*
*/
app.get('/', function(req, res) {
  
  debug('/index.js :: page opened', new Date());
  
  res.render('index', { title: 'Express' });


});



/**
*
*  Chat :: Send msg
*
*    Chat file log structure
*
*    [
*      {"user" : username,
*        "msg" : msg,
*        "time" : (new Date).getTime()},
*      {"user" : username,
*        "msg" : msg,
*        "time" : (new Date).getTime()},
*    ]
*
*/
app.post('/chat', function(req, res){
    
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {

        var POST = qs.parse(body),
            // json = {"user" : (POST.user || 'Anonymous'),
            //         "msg" : POST.msg,
            //         "time" : (new Date).getTime()};
            json = (POST.user || 'Anonymous') + ' | ' +  POST.msg + ' | ' + (new Date).getTime() + '\n';
        
        fs.appendFile(dbFile, json , function(err){

            console.log('successfully written ', (new Date()).getTime());

        })

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end();

    });
          
  

});

/**
*
*  Chat :: Read msg
*
*/
app.get('/chat', function(req, response){

  var filePath = path.join(__dirname, dbFile);
    
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (!err){
       // console.log('received data: ' + data);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      }else{
          console.log(err);
      }

  });

});




/**
*
*  Data scraping
*
*/
app.get('/scrape', function(req, res){
    
    if(!req.query.q) return;
    
    var url = req.query.q;
    var requestType = req.query.type || 'first';


    debug('/scrape route :: request:' + url, new Date());

    request(url, function(error, response, html){
        
        var json = {"meta": {}, "data" : []};

        if(!error){

            var $ = cheerio.load(html);
            var resultingItems = $('.result.thumbs ').find('.hproduct');

            if(requestType == 'first'){
                json.meta.total = $('.heading').find('#resultNumber').text().split(' ')[0].substr(1);
            }

            debug('resultingItems on page : ' + resultingItems.length, new Date());

            resultingItems.each(function(i, elem){

                var jsonItem = {};
                                
                 jsonItem.title = $('.addressTitle', elem).text();
                 jsonItem.link = $('.addressTitle a', elem).attr('href');
                 //jsonItem.raw = $('.deform', elem).text();
                 jsonItem.price = $('.price', elem).text().split(',-')[0];

                 json.data.push(jsonItem);

            })

            //debug(json);
            res.send(JSON.stringify(json, null, 4));
        }
    })
    
})

app.listen('8080')

console.log('pararius-scraper started', new Date());

exports = module.exports = app;