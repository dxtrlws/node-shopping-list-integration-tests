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

    //testing GET
    it('should list items on GET', function() {
        return chai.request(app)
        .get('/recipes')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
        });
    });

    //testing POST
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

    //testing PUT
    it('should update items on PUT', function() {
        const updateItem = {
            name: 'cupcakes',
            ingredients: ['flour', 'sugar', 'milk'],
            
        };
        return chai.request(app)
        .get('/recipes')
        .then(function(res) {
            updateItem.id = res.body[0].id;
            console.log(updateItem.id);
            return chai.request(app)
            .put(`/recipes/${updateItem.id}`)
            .send(updateItem);
        })
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.deep.equal(updateItem);
        });
    });

    //testing DELETE
    it('should delete items on DELETE', function(){
        return chai.request(app)
        .get('/recipes')
        .then(function(res){
            return chai.request(app)
            .delete(`/shopping-list/${res.body[0].id}`);
        })
        .then(function(res){
            res.should.have.status(204)
        });
    });
    
});