var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var app = express();
var Blog = require('./models/blog');
var Comment = require('./models/comment');
var User = require('./models/user');
//var seedDB = require('./seeds');

var commentRoutes = require('./routes/comments');
var blogRoutes    = require('./routes/blogs');
var indexRoutes   = require('./routes/index');

// App Config
mongoose.connect("mongodb://localhost/full_fledged_blog_app", { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
//seedDB();   seeding the database.....

// PASSPORT CONFIGURATION..........
app.use(require('express-session')({
    secret : "Lol....This is great",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/blogs", blogRoutes);

app.listen(4000, function(){
    console.log("Server started...");
});