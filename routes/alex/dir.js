/* jshint esversion:6 */

const fs = require('fs'),
    path = require('path'),
    file = require('./file.js');

var exports = module.exports = {};


/**
 * exports - lists a directory
 *
 * @param  {type} root     description
 * @param  {type} filepath description
 * @param  {type} cb       description
 * @return {type}          description
 */
exports.getDir = function(root, filepath, cb) {
    var dir = path.join(root, filepath);
    fs.readdir(dir, function(err, files) {
        if (err) cb(err);
        else {
            var fa = [],
                count = 0;
            for (i = 0; i < files.length; i++) {
                fa[i] = new file(root, filepath, files[i]);
                count++;
            }
            cb({
                'name': 'eldir',
                'root': root,
                'path': filepath,
                'fullpath': dir,
                'file_count': count,
                'files': fa
            });
        }
    });
};
