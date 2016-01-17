var express = require('express');
var router = express.Router();

router.get('/user_home',loggedIn, function(req, res) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: req.user});
});

router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    // collection.insert(req.body);

    collection.findOne({Name :req.body.Name,Password:req.body.Password},{},function(e,docs){
        if(e){
            res.send("something went wrong in login request");
        } else if(docs!=null){
            var role = dcos.role;
            if(role == "User"){
                res.render('user_home', {page: 'UserInfo', title: "Real Estate", user: doc})
            }
        }
    });
});




router.get('/updatedUser/:id', loggedIn, function(req, res) {
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
router.post('/userEditProfile', function(req, res) {
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
    res.redirect("/user/login");
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}
module.exports = router;
