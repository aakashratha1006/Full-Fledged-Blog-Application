var mongoose = require('mongoose');
var Blog     = require('./models/blog');
var Comment  = require('./models/comment');

var Data = [{
    name : "Test Blog 1",
    image : "https://static.wixstatic.com/media/375882_024ee961367a416395c3e3a48cd25df1~mv2.png/v1/fill/w_1200,h_628,al_c/375882_024ee961367a416395c3e3a48cd25df1~mv2.png",
    body : "Hello....This is our first post................................................................................."
},
{
    name : "Test Blog 2",
    image : "https://static.wixstatic.com/media/375882_024ee961367a416395c3e3a48cd25df1~mv2.png/v1/fill/w_1200,h_628,al_c/375882_024ee961367a416395c3e3a48cd25df1~mv2.png",
    body : "FORCA BARCA.................................................VISCA EL BARCA..................................................."
},
{
    name : "Corona virus sucks",
    image : "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/news/2020/01_2020/coronavirus_1/1800x1200_coronavirus_1.jpg",
    body : "Corona virus has already affected lives of many people and almost 14 lakh in USA and 80,000 in India"
}
]

function seedDB(){
    // Remove all the blogs.......
    Blog.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Remove Blogs");
        // Add some blogs....
        Data.forEach(function(seed){
            Blog.create(seed, function(err, Blog){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added Blog....");
                    // Create a comment
                    Comment.create({
                        text : "I agree",
                        author : "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            Blog.comments.push(comment);
                            Blog.save();
                            console.log("Created a new comment");
                        }
                    })
                }
            });
        });
    });
}

module.exports = seedDB;