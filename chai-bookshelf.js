var _          = require('lodash')
  , inflection = require('inflection')
;

module.exports = function(chai, utils) {
  chai.Assertion.addMethod('haveOne', function(expected) {
    var obj = this._obj;

    this.assert(
      'function' === typeof(obj.forge)
      , 'relationship subject should be a bookshelf model class'
    );

    this.assert(
      'function' === typeof(expected.forge)
      , 'relationship expectation should be a bookshelf model class'
    );

    var inst = obj.forge({});
    var table = _.result(expected.prototype, 'tableName');

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

    var data         = relationship.relatedData;
    var type         = data.type;
    var target       = data.target;

    this.assert(
      type == 'hasOne'
      , "expected a 'hasOne' relationship instead of '" + type + "'"
    );
  });
};
