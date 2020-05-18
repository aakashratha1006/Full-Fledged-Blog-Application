var express = require('express');
var router  = express.Router({mergeParams: true});

var Comment = require('../models/comment');
var Blog    = require('../models/blog');

//===================================================//
// COMMENTS ROUTE...................................//
//=================================================//

router.get('/new', isLoggedIn, function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {blog: blog});
        }

});
});

router.post('/', isLoggedIn, function(req, res){
    // Lookup for blog using ID
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect('/blogs');
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect('/blogs/' + blog._id);
                }
            })
        }
    });
});

// DESTROY ROUTE....
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

// Middleware........
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
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