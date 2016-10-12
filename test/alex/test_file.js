var config = require('../../config/config'),
    File = require('../../routes/alex/file.js'),
    assert = require('assert');

describe("Sys/routes/alex", function() {
    describe("File", function() {

        var root_dir = config.fs.root,
            path_dir = 'literatura/autores',
            file_name_orig = 'Test, procedure.test.esp.txt',
            file_name_change = 'Test, procedure.test_changed.esp.txt',
            f = new File(config.fs.root,file_name_orig);

        it("Instantiate", function(done) {
            assert.notEqual(f, null, "returns null");
            done();
        });

        it("Touch", function(done) {
            f.touch(function(f){
                assert.ok(f.type !== undefined, "file type not set");
                assert.notEqual(f.type, '', "file type empty");
                assert.equal(f.type,'f','type type wrong ['+f.type+']');
                assert.ok(f.name !== undefined, "file name not set");
                assert.notEqual(f.name, '', "file name empty");
                assert.equal(f.name,file_name_orig,'type name wrong ['+f.name+']');
                assert.ok(f.fullpath !== undefined, "file fullpath not set");
                assert.notEqual(f.fullpath, '', "file fullpath empty");
                assert.ok(f.size !== undefined, "file size not set");
                done();
            });
        });

        it("Rename", function(done) {
            f.rename(file_name_change,function(f){
                assert.ok(f.type !== undefined, "file type not set");
                assert.notEqual(f.type, '', "file type empty");
                assert.equal(f.type,'f','type type wrong ['+f.type+']');
                assert.ok(f.name !== undefined, "file name not set");
                assert.notEqual(f.name, '', "file name empty");
                assert.equal(f.name,file_name_change,'type name wrong ['+f.name+']');
                assert.ok(f.fullpath !== undefined, "file fullpath not set");
                assert.notEqual(f.fullpath, '', "file fullpath empty");
                assert.ok(f.size !== undefined, "file size not set");
                done();
            });
        });

        it("Delete", function(done) {
            f.delete(function(f){
                assert.ok(f.type !== undefined, "file type not set");
                assert.equal(f.type, '', "file type NOT empty");
                assert.ok(f.name !== undefined, "file name not set");
                assert.notEqual(f.name, '', "file name empty");
                assert.ok(f.fullpath !== undefined, "file fullpath not set");
                assert.notEqual(f.fullpath, '', "file fullpath empty");
                assert.ok(f.size !== undefined, "file size not set");
                done();
            });
        });

    });
});
