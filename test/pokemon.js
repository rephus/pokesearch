var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block

describe('/GET pokemon/json', () => {
    it('it should return all the pokemon from JSON', (done) => {
      chai.request(server)
          .get('/pokemon/json')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(151);
            done();
          });
    });
});

describe('/GET pokemon/search', () => {
    it('it should return Bulbasaur by name prefix', (done) => {
      chai.request(server)
          .get('/pokemon/search?q=bul')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                res.body[0]._source.name.should.be.eql('Bulbasaur');
                // Blastoise appears a second result because there is a 
                // 'bullet' text in the description,
                // However, we value names over descriptions
                res.body[1]._source.name.should.be.eql('Blastoise');
          
            done();
          });
    });

    it('it should return Pikachu by name infix', (done) => {
      chai.request(server)
          .get('/pokemon/search?q=kach')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                res.body[0]._source.name.should.be.eql('Pikachu');          
            done();
          });
    });

    it('it should filter by types', (done) => {
      chai.request(server)
          .get('/pokemon/search?q=water')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.gt(1);
                res.body[0]._source.types[0].should.be.eql('water');          
            done();
          });
    });

    it('it should filter by description', (done) => {
      chai.request(server)
          .get('/pokemon/search?q=dark')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.gt(1);
                res.body[0]._source.description.should.have.string('dark');
            done();
          });
    });

    it('it should not filter by evolution', (done) => {
      chai.request(server)
          .get('/pokemon/search?q=Raichu')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eq(1);
                res.body[0]._source.name.should.be.eql('Raichu');          
            done();
          });
    });
});