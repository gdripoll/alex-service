/* jshint esversion:6 */

var fs = require('fs'),
    path = require('path');


const AUTHOR = 0;
const TITLE = 1;
const LANG = 2;
const EXT = 3;


var exports = module.exports = function(root, dir, name) {

    this.dir = "";
    this.name = "";
    this.type = "";
    this.size = "";
    this.meta = "";

    //
    // refresh
    //
    this.refresh = function(root=this.root, dir=this.dir, name=this.name) {
        this.root = root;
        this.dir = dir;
        this.name = name;
        // console.log('[REFRESH] root:' + this.root + ' dir:' + this.dir + ' name:' + this.name);
        this.fullpath = path.join(this.root, this.dir, this.name);
        this.linkpath = encodeURIComponent(path.join(this.dir, this.name));

        this.exists = fs.existsSync(this.fullpath);
        if (this.exists) {
            this.getStats(this.fullpath); // get statistics
            this.getMeta(); // gets metadata
        }

    };
    this.getMeta = function() {
        if (this.type == 'f') {
            var aName = name.split('.'),
                meta = {},
                errors = [];

            if (aName.length < 4) {
                errors.push("Not enough dots [" + aName.length + " tracks]");
            } else if (aName.length < 4) {
                errors.push("Too many dots [" + aName.length + " tracks]");
            }
            meta = {
                'author': aName[AUTHOR],
                'title': aName[TITLE],
                'lang': aName[LANG],
                'ext': aName[EXT]
            };
            if (meta.author != this.dir.split('/').pop()) {
                errors.push("Author name don't match.");
            }
            if (meta.lang) {
                if (meta.lang.length != 3) {
                    errors.push("Invalid language [" + meta.lang + "]");
                }
            }
            if (meta.ext == 'zip') {
                errors.push("ZIP file detected.");
            }
            this.meta = meta;
            this.meta.errors = errors;

        } else {

            // TODO meta de directorio

        }
    };
    this.getStats = function(fullpath) {
        var stats = fs.statSync(fullpath);
        this.type = stats.isFile() ? 'f' : 'd';
        this.size = stats.size;
    };

    //
    // operaciones
    //
    this.touch = function(cb) {
        fstream = fs.createWriteStream(this.fullpath, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true
        });
        fstream.write('Hello world!\n');
        fstream.end();
        // this.refresh(this.root, this.dir, this.name);
        this.refresh();
        console.log('[TOU] ' + this.fullpath);
        cb(this);
    };
    this.rename = function(newName, cb) {
        if (this.type == 'f') {
            var from = this.fullpath,
                to = path.join(this.root, newName);
            fs.rename(from, to, (err) => {
                this.refresh(this.root, path.dirname(newName), path.basename(newName));
                console.log('[REN] >> ' + this.fullpath);
                cb(this);
            });
        } else {
            return new Error("Not implemented");
        }
    };
    this.delete = function(cb) {
        if (this.type == 'f') {
            fs.unlink(this.fullpath, (err) => {
                if (err) return console.error(err);
                this.refresh();
                console.log('[DEL] ' + this.fullpath);
                cb(this);
            });
        } else {
            return new Error("Not implemented");
        }
    };

    //
    // init
    //

    if (typeof(name) == 'undefined') {
        name = path.basename(dir);
        dir = path.dirname(dir);
    }
    this.refresh(root, dir, name);

};
