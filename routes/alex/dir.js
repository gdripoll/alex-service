/* jshint esversion:6 */

const fs = require('fs'),
    path = require('path'),
    file = require('./file.js');

var exports = module.exports = {};

exports.getDir = function(root, filepath, cb) {
    var dir = path.join(root, filepath);
    console.log(dir);
    fs.readdir(dir, function(err, files) {
        if (err) cb(err);
        else {
            var fa = [],
                count = 0;
                console.log("encontre " +files.length+" archivos.");
            for (i = 0; i < files.length; i++) {
                fa[i] = new file(root, filepath, files[i]);
                count++;
            }
            cb({
                'name': 'eldir',
                'root': root,
                'path': filepath,
                'fullpath': root + '/' + path,
                'file_count': count,
                'files': fa
            });
        }
    });
};
