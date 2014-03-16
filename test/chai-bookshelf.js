var chai      = require('chai')
  , expect    = chai.expect
  , subject   = require('../')
  , Bookshelf = require('bookshelf')
  , inspect
  , db
  , Class
  , School
  , Slacker
  , Student
  , Transcript
;

describe("chai-bookshelf", function() {
  before(function() {
    chai.use(function (chai, utils) {
      inspect = utils.objDisplay;

      chai.Assertion.addMethod('fail', function (message) {
        var obj = this._obj;

        new chai.Assertion(obj).is.a('function');

        try {
          obj();
        } catch (err) {
          this.assert(
              err instanceof chai.AssertionError
            , 'expected #{this} to throw a chai exception, but it threw ' + inspect(err));
          this.assert(
              err.message === message
            , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
          return;
        }

        this.assert(false, 'expected #{this} to fail, but no exception was thrown');
      });
    });

    chai.use(subject);
  });

  beforeEach(function() {
    this.c = {}; // context that is rebuild between tests

    db = Bookshelf.initialize({
      client: 'sqlite'
      , connection: {
        filename: ':memory:'
      }
    });

    // student hasOne transcript
    // school  hasMany students
    // class belongsTo school
    // student belongsToMany classes

    Class = db.Model.extend({
      tableName: 'classes'
      , school: function() {
        return this.belongsTo(School);
      }
    });

    Transcript = db.Model.extend({
      tableName: 'transcripts'
    });

    Student = db.Model.extend({
      tableName: 'students'
      , transcript: function() {
        return this.hasOne(Transcript);
      }
    });

    School = db.Model.extend({
      tableName: 'schools'
    });

    Slacker = db.Model.extend({});
  });

  describe(".haveOne", function() {
    context("when given two related models", function() {
      it("passes", function() {
        expect(Student).to.haveOne(Transcript);
      });
    });

    context("when given two unrelated models", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Transcript).to.haveOne(Class);
        }).to.fail("model classes have no relation");
      });
    });

    context("when given two models with a non-hasOne relation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.haveOne(School);
        }).to.fail("expected a 'hasOne' relationship instead of 'belongsTo'");
      });
    });

    context("when given a class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.haveOne('not a bookshelf model class');
        }).to.fail("relationship expectation should be a bookshelf model class");
      });
    });

    context("when related class does not have a table defined", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.haveOne(Slacker);
        }).to.fail("relationship expectation does not have a tableName");
      });
    });

    context("when given a non-class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect('not a bookshelf model class').to.haveOne(School);
        }).to.fail("relationship subject should be a bookshelf model class");
      });
    });
  });
});
