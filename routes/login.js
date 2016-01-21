var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET users listing. */
//router.get('/', function(req, res, next) {
//res.send('respond with a resource');
//});
router.get('/login', function(req, res) {
    if(req.user){
        res.redirect("account/user_home");
    }
    res.render('owner/property', {
        title:"Login",
        message:""
    });
});



router.post('/logininfo',function(req, res) {
    console.log(req.user+"som");
    passport.authenticate('login', function(err, user, info) {
        console.log(JSON.stringify(req.user)+"body");
      //  if (err) { return next(err); }
        // Redirect if it fails
        if (!user) { return res.redirect('/login'); }
        console.log(user +"tea");
        res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: user});
    })(req,res);
});
/*router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    // collection.insert(req.body);

    collection.findOne({Name :req.body.Name,Password:req.body.Password},{},function(e,docs){
        if(e){
            res.send("something went wrong in login request");
        } else if(docs!=null){
            var role = docs.role;
            if(role == "User"){
                res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: docs});
            }
        }
    });
});*/
router.post('/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) {
           // mysend(res, 500, 'Ups. Something broke!');
            res.redirect('login');
            console.log(err+'err');
        } else if (info) {
            console.log(info+'info');
           // mysend(res, 401, 'unauthorized');
            res.redirect('login');
        } else {
            req.login(user, function(err) {
                if (err) {
                   // mysend(res, 500, 'Ups.');
                    console.log(err+'log');
                    res.redirect('login');
                } else {
                    console.log(JSON.stringify(req.user)+"session")
                    //res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: user});
                    res.redirect('account/user_home');
                }
            })
        }
    })(req, res, next);
});
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}
function isAuthenticated(req, res, next) {
    if (req.user) {
        res.redirect("/account/user_home");
    }
    //req.next();
}





module.exports = router;
