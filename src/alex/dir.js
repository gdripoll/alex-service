/* jshint esversion:6 */

const fs = require('fs'),
    path = require('path'),
    File = require('./file.js');


/**
 * Directory object
 */
class Dir {

    /**
     * Constructor
     *
     * @param  {path} root Root path
     * @return {Dir}
     */
    constructor(root) {
        this.root = root;

    }

    /**
     * Gets a Directory listing
     *
     * @param  {path} dirpath  directory path
     * @param  {closure} cb    callback function
     * @return {null}
     */
    getDir(dirpath, cb) {
        var dir = path.join(this.root, dirpath),
            name = path.basename(dir);
        fs.readdir(dir, (err, files) => {
            if (err) cb(err);
            else {
                var fa = [],
                    count = 0;
                for (let i = 0; i < files.length; i++) {
                    fa[i] = new File(this.root, dirpath, files[i]);
                    count++;
                }
                cb({
                    'name': 'eldir',
                    'path': dirpath,
                    'fullpath': dir,
                    'file_count': count,
                    'files': fa
                });
            }
        });
    }
}

var exports = module.exports = Dir;
