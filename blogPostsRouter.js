const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('blog post #1', 'abc', 'j. mignone', '05-01-18');
BlogPosts.create('blog post #2', 'xyz', 'a. smith', '01-10-18');
BlogPosts.create('blog post #3', 'def', 'j. stevens', '10-15-17');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \'${field}\' in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(  req.body.title,
                                    req.body.content,
                                    req.body.author,
                                    req.body.publishDate
                                 );
    res.status(201).json(item);
            
});

module.exports = router;