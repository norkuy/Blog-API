const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

const app = express();
const blogPostsRouter = require('./blogPostsRouter');

app.use(bodyParser.json())
app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
});