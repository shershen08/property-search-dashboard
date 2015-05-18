var debug = require('debug')('http');
var express = require('express');
var router = express.Router();
//var mongoose = require( 'mongoose' );
//var Todo     = mongoose.model( 'Todo' );

/* GET home page. */
router.get('/', function(req, res) {
  
  debug('//////////////////////// GET home page in index.js ///////////////////////');
  
  res.render('index', { title: 'Express' });

});

module.exports = router;