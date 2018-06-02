const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should get blog posts on GET', function() {

        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.be.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                
                const keys = ['id', 'title', 'content', 'author', 'publishDate'];
                
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(keys);
                });
            });

    });

    it('should add a blog post on POST', function() {
        const newBlogPost = {
            title: "A New Blog Post",
            content: "Really cool blog post",
            author: "John Smith",
            publishDate: "06-02-18"
        }
        
        return chai.request(app)
            .post('/blog-posts')
            .send(newBlogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json; // why res and not res.body?
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.not.equal(undefined);
                const keys = ['id', 'title', 'content', 'author', 'publishDate'];
                expect(res.body).to.include.keys(keys);
                expect(res.body).to.deep.equal(Object.assign(newBlogPost, { id: res.body.id }));
            })
    });

    it('should edit a blog post on PUT', function() {

        let blogPosts;

        let updatedPost = {
            title: "Updated Blog Post",
            content: "Cool blog post",
            author: "Samantha Smith",
            publishDate: "03-10-18"
        }

        return chai.request(app)
            .get('/blog-posts')    
            .then(function(res) {

                updatedPost = Object.assign({ id: res.body[0].id }, updatedPost);

                blogPosts = res.body.slice(1);
                blogPosts.unshift(updatedPost);

                return chai.request(app)
                    .put(`/blog-posts/${updatedPost.id}`)
                    .send(updatedPost);
            
            }).then(function(res) {
                expect(res).to.have.status(204);

                return chai.request(app)
                    .get('/blog-posts');

            }).then(function(res) {
                expect(res.body).to.deep.equal(blogPosts);
            });
    
    });

    it('should delete a blog post on DELETE', function() {

        let modifiedPosts;

        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                const firstBlogPost = res.body[0];
                const firstBlogPostId = res.body[0].id;
                
                const index = res.body.indexOf(firstBlogPost);
                res.body.splice(index, 1);

                modifiedPosts = res.body;

                return chai.request(app)
                    .delete(`/blog-posts/${firstBlogPostId}`);

            }).then(function(res) {
                expect(res).to.have.status(204);
                
                return chai.request(app)
                    .get('/blog-posts');

            }).then(function(res) {

                expect(res.body).to.deep.equal(modifiedPosts);
            
            });
    });

});