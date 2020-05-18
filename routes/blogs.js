var express = require('express');
var router  = express.Router({mergeParams: true});

var Blog = require('../models/blog');

router.get('/', function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        }else{
            res.render('blogs/blog', {blogs: allBlogs, currentUser: req.user});
        }
    });
});

// NEW ROUTE.....

router.get('/add_12345', isLoggedIn, function(req, res){
    res.render('blogs/new');
});

// CREATE ROUTE....

router.post('/', isLoggedIn, function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newBlog = {title : title, image : image, description : desc, author : author};
    Blog.create(newBlog, function(err, newBlog){
        if(err){
            res.render('blogs/new');
        }else{
            res.redirect('/blogs');
        }
    });
});

// SHOW ROUTE....

router.get('/:id', function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('blogs/show', {blog : foundBlog});
        }
    });
});

// EDIT ROUTE...

router.get('/:id/edit', checkBlogOwnership, function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
                res.render('blogs/edit', {blog: foundBlog});
        });
});

// UPDATE ROUTE.....

router.put('/:id', checkBlogOwnership, function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE ROUTE.....

router.delete('/:id', checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});

// Middleware........
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkBlogOwnership(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect('back');
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("You do not have the permission to do that!!!!");
                }
            }
        });
    }else{
        res.send("You need to be logged in to do that");
    }
}

module.exports = router;