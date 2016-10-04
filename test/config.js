var config = require('../config/config');
var assert = require('assert');

describe("Sys/config", function() {
    describe("fs", function() {

        it("fs should be set", function(done) {
                assert.notEqual(config.fs,null,"fs not set");
                done();
        });

				it("fs should be set properly", function(done) {
                assert.notEqual(config.fs.root,null,"root not set");
                done();
        });

    });

});
