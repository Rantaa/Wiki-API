const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")

.get(function(req, res) {

    Article.find(function(err, foundArticles) {
        if (err) {
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    })
})

.post(function(req, res) {

    const newTitle = req.body.title;
    const newContent= req.body.content;


    const newArticle = new Article({
        title: newTitle,
        content: newContent
    })

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err);
        }
    })
});

app.route("/articles/:title")

.get(function(req, res) {
 
    Article.findOne({title: req.params.title}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article found matching that title.");
        }
    });
})

.put(function(req, res) {

    Article.updateOne(
        {title: req.params.title}, 
        {$set: {title: req.body.title, content: req.body.content}},
        {overwrite: true},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.title},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated the article.");
            } else {
                res.send(err);
            }
        }
    );

})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.title}, function(err) {
        if (!err) {
            res.send("Successfully deleted the article.");
        } else {
            res.send(err);
        }
    });
});








app.listen(3000, function() {
    console.log("Server running on port 3000.");
});