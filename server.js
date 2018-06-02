const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

const app = express();
const blogPostsRouter = require('./blogPostsRouter');

app.use(bodyParser.json())
app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err);
        });
    });
}


function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('closing server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };

