var relations = require('./assertions/relations')
;

module.exports = function(chai, utils) {
  chai.use(relations);
};
