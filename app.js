var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var app = express();

// App Config
mongoose.connect("mongodb://localhost/full_fledged_blog_app");
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
    title: "Test blog 1",
    image: "https://bsmedia.business-standard.com/_media/bs/img/article/2020-05/08/full/1588933553-9511.jpg",
    body: "Hello this is a blog post......"
});*/


// RESTFUL ROUTES...

app.get('/', function(req, res){
    res.render('index');
});

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render('blog', {blogs: blogs});
        }
    });
});

// NEW ROUTE.....

app.get('/blogs/add_12345', function(req, res){
    res.render('new');
});

// CREATE ROUTE....

app.post('/blogs', function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        }else{
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE....

app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('show', {blog : foundBlog});
        }
    });
});

// EDIT ROUTE...

app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('edit', {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE.....

app.put('/blogs/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE ROUTE.....

app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});

app.listen(3000, function(){
    console.log("Server started...");
});