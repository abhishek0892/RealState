var express = require('express');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
//});
router.get('/userlist', function(req, res) {
  var db = req.db;
  //res.setHeader('Content-Type', 'text/plain');
  var collection = db.get('users');
  collection.find({},{},function(e,docs){
    res.render('userlist', { title: 'Express' , userlist:docs});
    res.end();

  });

});


module.exports = router;
