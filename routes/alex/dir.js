/* jshint esversion:6 */

fs = require('fs');
var file = require('./file.js');

var exports = module.exports = {};

exports.getDir = function(root, path, cb) {
	var dir = root + '/' + path;
	console.log(dir);
	fs.readdir(dir, function(err, files) {
		if (err) cb(err);
		else {
			var fa = [],
				count = 0;
			for (i = 0; i < files.length; i++) {
				fa[i] = new file(dir, files[i]);
				count++;
			}
			cb({
				'name': 'eldir',
				'root': root,
				'path': path,
				'fullpath': root + '/' + path,
				'file_count': count,
				'files': fa
			});
		}
	});
};
