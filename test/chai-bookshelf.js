var chai      = require('chai')
  , expect    = chai.expect
  , subject   = require('../chai-bookshelf')
  , bookshelf = require('bookshelf')
;

describe("chai-bookshelf", function() {
  it("can be used by chai without error", function() {
    chai.use(subject);
  });
});
