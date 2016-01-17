var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
//router.get('/', function(req, res, next) {
//res.send('respond with a resource');
//});
router.get('/user_register', function(req, res) {
    res.render('user_register', {
        title:"User Register",
        message:"",
        errors:""

    });
});
router.post('/user_signup', function(req, res) {

    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('mobile','Should be numeric').isNumeric();
    req.assert('mobile','Invalide mobile number').isMobile();


    var errors = req.validationErrors();
    if(errors){
        res.render('user_register',{title:'Register', message:'',errors:errors});

    } else {
        var db = req.db;

        if (req.body.role == 'User') {
            var collection = db.get('users');

            var user = req.body;
            collection.findOne({email: user.email}, function (e, doc) {
                if (e) {
                    res.send("some thing wen wrong");
                } else {
                    if (doc == null) {
                        collection.insert(user, function (e, doc) {
                            if (e) {
                                console.log("some thing went worng");
                            } else {
                                res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: doc})
                            }
                        });
                    } else {
                        var ac =[];
                        ac.push({msg :"This user id already exist"});
                        res.render('user_register',{title:'Register', message:'',errors:ac});
                    }
                }
            });

        }
    }

});


router.post('/user_register', function (req, res, next) {
    passport.authenticate('user_register', function (err, user, info) {
        console.log("in register straitegy");
        if (err) {
            // mysend(res, 500, 'Ups. Something broke!');
            console.log("err");
        } else if (info) {
            // mysend(res, 401, 'unauthorized');
            console.log("info"+info);
        } else {
            req.login(user, function(err) {
                if (err) {
                    console.log("err login" + err);
                    // mysend(res, 500, 'Ups.');
                } else {
                    console.log(JSON.stringify(req.user)+"session")
                    //res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: user});
                    res.redirect('account/user_home');
                }
            })
        }
    })(req, res, next);
});

module.exports = router;
