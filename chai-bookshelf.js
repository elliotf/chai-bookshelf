var _          = require('lodash')
  , inflection = require('inflection')
;

module.exports = function(chai, utils) {
  function validateRelation(expectedType, subject, expected) {
    // make sure we're dealing with backbone models
    this.assert(
      'function' === typeof(subject.forge)
      , 'relationship subject should be a bookshelf model class'
    );
    this.assert(
      'function' === typeof(expected.forge)
      , 'relationship expectation should be a bookshelf model class'
    );

    var inst = subject.forge({});
    var table = _.result(expected.prototype, 'tableName');

    // give a meaningful error when a tableName does not exist
    this.assert(
      table
      , 'relationship expectation does not have a tableName'
    );

    var relationName = inflection.singularize(table);
    var relationship = inst.related(relationName);

    // assert that there is a relationship
    this.assert(
      relationship
      , "model classes have no relation"
    );

    // assert on relationship type
    var actualType = relationship.relatedData.type;
    this.assert(
      expectedType === actualType
      , "expected a '" + expectedType + "' relationship instead of '" + actualType + "'"
    );
  }

  chai.Assertion.addMethod('haveOne', function(expected) {
    var subject = this._obj;

    validateRelation.call(this, 'hasOne', subject, expected);
  });
};
