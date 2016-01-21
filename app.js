var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validate = require('express-validator');
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var uiid = require('node-uuid');
var _ = require('underscore')
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');


var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var account = require('./routes/account');
var owner_account = require('./routes/owner/owner_account');
var app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(expressSession({ secret: 'keyboard cat', cookie: {secure : false, maxAge: 60000 }, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(validate({customValidators: {
    isMobile: function(value) {
        console.log(value.length);
        return (value.length==10);
    },
}}));


app.use(function(req,res,next){
  req.db = db;
  next();
});
app.post(function(req, res,next){
  req.db = db;
  next();
});

passport.serializeUser(function(user, done) {
    console.log(JSON.stringify(user)+"at serialise");
   // if(user.session.passport.user){
        console.log("user session");
      //  user.passport.session.user = {};
   // }
    if(user==null){
        done(null,null);
    } else {
        done(null, user.username);
    }
});

passport.deserializeUser(function(id, done) {
    //
    var collection = db.get('users');
    // collection.insert(req.body);

    collection.findOne({username : id},{},function(err,user){
        console.log(JSON.stringify(user+"at deserlz"));
        done(err, user);
    });
});

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log(username);
        console.log(password);
        console.log(JSON.stringify(req.body));
        var db = req.db;
        var collection = db.get('users');
        // collection.insert(req.body);

        collection.findOne({username : username},{},function(err,user){
            console.log('user is');

            if (err)
                return done(err);
            // Username does not exist, log error & redirect back
            if (!user){
                console.log('User Not Found with username '+username);
                return done(null, false,req.flash('message', 'User Not found.'));
            }
            // User exists but wrong password, log the error
            if (!isValidPassword(user, password)){
                console.log('Invalid Password');
                return done(null, false,
                    req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from
            // done method which will be treated like success
            console.log(user+"before auccess");
            return done(null, user);

        });
    }));

var isValidPassword = function(user, password){
    return password==user.password;
}

passport.use('user_register', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log(username);
        console.log(password);
        console.log(JSON.stringify(req.body));
        var db = req.db;
        var collection = db.get('users');
        // collection.insert(req.body);

        collection.findOne({username : username},{},function(err,user){
            console.log('user is');

            if (err)
                return done(err);
            // Username does not exist, log error & redirect back
            if(user){
                console.log("if user exist");
                return done(null, false,req.flash("message","User already Exists"));
            }
            if (!user) {
                console.log("if user not exist");
                var collection = db.get("users");
                console.log(JSON.stringify(user)+"soer1");
                var myuser  = req.body;
                var properties = {properties:[]};
                console.log(properties+"sdaf");
              //  jQuery.extend(myuser, properties);
                // var merged_user =   _.extend(myuser, properties);
                var merged_user = JSON.parse((JSON.stringify(myuser) + JSON.stringify(properties)).replace(/}{/g,","))

                collection.insert(merged_user, function (er, user) {
                    if (er || !user) {
                        console.log("if something exist");
                        res.send("Something went wrong while user register");
                    } else {
                        return done(null, user);
                    }
                });
            }

        });
    }));





app.use('/', routes);
//app.use('/users', users);
app.use('/user',login);
app.use('/user/register', register);
app.use('/user/account',account);
app.use('/owner/account',owner_account);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
