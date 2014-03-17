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

chai.Assertion.includeStack = true;

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
    db = Bookshelf.initialize({
      client: 'sqlite'
      , connection: {
        filename: ':memory:'
      }
    });

    Class = db.Model.extend({
      tableName: 'classes'
      , school: function() {
        return this.belongsTo(School);
      }
      , student: function() {
        return this.belongsToMany(Student);
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
      , student: function() {
        return this.hasMany(Student);
      }
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
      it("raises a helpful error", function() {
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

  describe(".haveMany", function() {
    context("when given two related models", function() {
      it("passes", function() {
        expect(School).to.haveMany(Student);
      });
    });

    context("when given two unrelated models", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Transcript).to.haveMany(Class);
        }).to.fail("model classes have no relation");
      });
    });

    context("when given two models with a non-hasMany relation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.haveMany(School);
        }).to.fail("expected a 'hasMany' relationship instead of 'belongsTo'");
      });
    });

    context("when given a class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.haveMany('not a bookshelf model class');
        }).to.fail("relationship expectation should be a bookshelf model class");
      });
    });

    context("when related class does not have a table defined", function() {
      it("raises a helpful error", function() {
        expect(function(){
          expect(Class).to.haveMany(Slacker);
        }).to.fail("relationship expectation does not have a tableName");
      });
    });

    context("when given a non-class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect('not a bookshelf model class').to.haveMany(School);
        }).to.fail("relationship subject should be a bookshelf model class");
      });
    });
  });

  describe(".belongTo", function() {
    context("when given two related models", function() {
      it("passes", function() {
        expect(Class).to.belongTo(School);
      });
    });

    context("when given two unrelated models", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Transcript).to.belongTo(Class);
        }).to.fail("model classes have no relation");
      });
    });

    context("when given two models with a non-hasMany relation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Student).to.belongTo(Transcript);
        }).to.fail("expected a 'belongsTo' relationship instead of 'hasOne'");
      });
    });

    context("when given a class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.belongTo('not a bookshelf model class');
        }).to.fail("relationship expectation should be a bookshelf model class");
      });
    });

    context("when related class does not have a table defined", function() {
      it("raises a helpful error", function() {
        expect(function(){
          expect(Class).to.belongTo(Slacker);
        }).to.fail("relationship expectation does not have a tableName");
      });
    });

    context("when given a non-class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect('not a bookshelf model class').to.belongTo(School);
        }).to.fail("relationship subject should be a bookshelf model class");
      });
    });
  });

  describe(".belongToMany", function() {
    context("when given two related models", function() {
      it("passes", function() {
        expect(Class).to.belongToMany(Student);
      });
    });

    context("when given two unrelated models", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Transcript).to.belongToMany(Class);
        }).to.fail("model classes have no relation");
      });
    });

    context("when given two models with a non-hasMany relation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Student).to.belongToMany(Transcript);
        }).to.fail("expected a 'belongsToMany' relationship instead of 'hasOne'");
      });
    });

    context("when given a class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect(Class).to.belongToMany('not a bookshelf model class');
        }).to.fail("relationship expectation should be a bookshelf model class");
      });
    });

    context("when related class does not have a table defined", function() {
      it("raises a helpful error", function() {
        expect(function(){
          expect(Class).to.belongToMany(Slacker);
        }).to.fail("relationship expectation does not have a tableName");
      });
    });

    context("when given a non-class subject and a non-class expectation", function() {
      it("raises an error", function() {
        expect(function(){
          expect('not a bookshelf model class').to.belongToMany(School);
        }).to.fail("relationship subject should be a bookshelf model class");
      });
    });
  });
});
