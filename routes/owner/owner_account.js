var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs= require('fs');
var uiid = require('node-uuid');
router.get('/login', function(req, res) {
    if(req.user){
        res.redirect("ownerAccount");
    }
    res.render('owner/owner_login', {
        title:"Login",
        message:""
    });
});


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
                    res.redirect('/owner/account/ownerAccount');
                }
            })
        }
    })(req, res, next);
});
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/account/login');
    }
}
function isAuthenticated(req, res, next) {
    if (req.user) {
        res.redirect("/account/ownerAccount");
    }
}
router.get('/register', function(req, res) {
    res.render('owner/owner_register', {
        title:"Owner Register",
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

            collection.findOne({username: user.username}, function (e, doc) {
                console.log(JSON.stringify(user)+"soer");
                if (e) {
                    res.send("some thing wen wrong");
                } else {
                    if (doc == null) {
                        collection.insert(user, function (e, doc) {
                            if (e) {
                                console.log("some thing went worng");
                            } else {
                                res.render('owner_account', {page: 'UserInfo', title: "Real Estate", user: doc})
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


router.post('/register', function (req, res, next) {
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
                    res.redirect('/owner/account/ownerAccount');
                }
            })
        }
    })(req, res, next);
});


router.get('/ownerAccount',loggedIn, function(req, res) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('owner/owner_account', {page: 'UserInfo', title: "Real Estate", user: req.user});
});




router.get('/getUpdatedOwner/:id', loggedIn, function(req, res) {
    /* var db = req.db;
     var id= req.params.id;
     console.log("id here" + id);
     var collection = db.get("users");
     collection.findOne({username:id},function(e,dc){

     console.log(dc.name);
     console.log(dc.mobile+"*******");
     res.send({user:dc});
     //res.end(dc);
     });*/
    console.log(JSON.stringify(req.user)+"udpated");
    res.send({user:req.user});


});
router.post('/editOwnerProfile', function(req, res) {
    if(!req.user){
        res.send({user:null});
    } else {
        var db = req.db;
        var id = req.body.username;
        var role = req.body.role;
        console.log(JSON.stringify(req.body).toString() + " some");
        console.log(role.toString() + "role");
        console.log("User");
        console.log(role.toString() === "User");
        role = role.toString('utf-8').trim();
        if (role === "User") {
            //console.log(req.user.username+ "edit");
            var collection = db.get("users");
            collection.update({username: req.body.username}, {
                $set: {
                    mobile: req.body.mobile,
                    name: req.body.name
                }
            }, function (e, doc) {
                console.log(doc.toString());
                if (e) {
                    console.log("some error");
                } else {
                    collection.findOne({username: id}, function (e, user) {
                        console.log(user + "update 1");
                        req.login(user, function (err) {


                            console.log("After relogin: " + JSON.stringify(req.user));
                            //res.send(200);
                            console.log(JSON.stringify(user) + "before updateds");
                            //res.end();
                            res.send({message: "Success fully updated", user: req.user});
                        });
                        //res.send({message:"Success fully updated",user: dc});

                    });

                }
            });
        } else {
            console.log((role.toString() === "User".toString()) + "here")
        }
    }
});

router.get("/userProfile/:id",  loggedIn, function (req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log(id+"profile");
    var collection  = db.get("users");
    collection.findOne({email:id}, function(e,user){
        console.log(JSON.stringify(user));
        res.send({user:user});
    });

});

router.get("/logout", function(req, res){
    req.session.destroy(function(err){
    });
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect("/owner/account/login");
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/owner/account/login');
    }
}
router.get("/getPropertyList", function (req,res) {
    fs.readFile('views/owner/property_list.ejs',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});
router.post("/addPropertyLocation", function (req, res) {
    console.log(JSON.stringify(req.body));
    var propertyLocation = req.body;
    var db = req.db;
    var collection = db.get('users');
    // var uiid = uiid.v4();
    var uniqueId =  req.user.username+Math.random();
    collection.update({username:req.user.username},{$push:{properties:{propId :uniqueId, address:propertyLocation}}}, function(err, user){
        console.log(user +"new user");
        res.send({user:user, addressId:uniqueId, message :"Property address susccusfully added."});
    });

});
router.post("/addPropertyDetailForm/:uniqueId", function (req, res) {
    console.log(JSON.stringify(req.body));
    var propertyLocation = req.body;
    var db = req.db;
    var uniqueId = req.params.uniqueId;
    var collection = db.get('users');
    // var uiid = uiid.v4();
    collection.update({username:req.user.username,properties:{$elemMatch:{propId:uniqueId}}},{$set:{prop}}, function(err, user){
        console.log(user +"new user");
        res.send({user:user, message :"Property address susccusfully added."});
    });

});

module.exports = router;
