/* jshint esversion:6 */

var config = require('../../config/config');
var dir = require('../../routes/alex/dir.js');
var assert = require('assert');

describe("Sys/routes/alex", function() {
	describe("dir", function() {

		var root_dir = config.fs.root;
		var path_dir = 'literatura/autores';

		it("Should return propper root|path|fullpath", function(done) {
			var res = dir.getDir(root_dir, path_dir, function(files) {
				assert.notEqual(files, null, `returns null ${res}`);
				assert.equal(files.root, root_dir, "fails root dir -- " + root_dir);
				assert.equal(files.path, path_dir, "failt path dir -- " + path_dir + " | " + files.path);
				assert.equal(files.fullpath, root_dir + '/' + path_dir, "!!! "+files.fullpath);
				done();
			});
		});

		it("Should return some files", function(done) {
			var res = dir.getDir(root_dir, path_dir, function(files) {
				assert.notEqual(files.files, null, "returns null");
				assert.equal(files.files.length, files.file_count, "fails filecount real [" + files.files.length + "] obtenido [" + files.file_count + "]");
				done();
			});
		});

		it("File should be propperly formated", function(done) {
			var res = dir.getDir(root_dir, path_dir, function(files) {
				assert.ok(files.file_count > 0, "files not found");
				var f = files.files[0];
				assert.ok(f.type !== undefined, "file type not set");
				assert.notEqual(f.type, '', "file type empty");
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
