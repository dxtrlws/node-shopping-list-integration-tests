const chai = require('chai');
const chaiHTTP = require('chai-HTTP');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHTTP);

describe('Recipes', function() {

    before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it('should list items on GET', function() {
        return chai.request(app)
        .get('/recipes')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
        });
    });
    it('should add an item on POST', function() {
        const newItem = {name: 'pizza', ingredients:["tomato sauce", "pepperoni", "dough"]};
        return chai.request(app)
        .post('/recipes')
        .send(newItem)
        .then(function(res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'name', 'ingredients');
            res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });
    });
    
});