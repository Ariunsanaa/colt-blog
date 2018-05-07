var express = require('express');
var app = express();
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


// APP CONFIG 
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);

// Sample data
// Blog.create({
//     title: "Test blog",
//     image: "https://cdn.images.express.co.uk/img/dynamic/4/590x/usain-bolt-net-worth-how-much-earn-income-833865.jpg",
//     body: "Эрчим хүч хэмнэх, эрчим хүчний үйлдвэрлэл, дамжуулалт, түгээлт, хэрэглээний бүх түвшинд үр ашгийг дээшлүүлж, хууль, эрх зүй, зохицуулалтын орчинг боловсронгуй болгох, төрийн байгууллагууд хоорондын зохицуулалт, мэдээллийн урсгалыг сайжруулах, бодлого үйл ажиллагааны уялдааг хангах, санхүүжилт, хөрөнгө оруулалтын эх үүсвэрийг оновчтой бүрдүүлэх, олон улсын байгууллагын үүрэг оролцоог тодорхойлох гэх мэт сэдвээр хэлэлцжээ."
// });


//RESTFUL ROUTES

// INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});
// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            // redirect to the index
            res.redirect("/blogs");
        }
    })
    
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
    // res.send("SHOW PAGE!");
});


app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render("edit", {blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    // Blog.findByIdAndUpdate(id, newData, callback);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //    res.send("Destroy route");
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    //redirect somewhere
});

app.listen(process.env.PORT || 5000);
console.log('Server Started');