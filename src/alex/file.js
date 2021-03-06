/* jshint esversion:6 */

var fs = require('fs'),
    path = require('path');


const AUTHOR = 0;
const TITLE = 1;
const LANG = 2;
const EXT = 3;

/**
 * File management
 * @author Gustavo Ripoll <gdripoll@gmail.com>
 */
class File {

    // Some constructor
    //
    //

    /**
     * Just a file hope
     *
     * @param  {path}   root  mounting root
     * @param  {path}   dir   file internal path
     * @param  {string} name  file name
     * @return {null}         Damm, it's a constructor
     */
    constructor(root, dir, name) {
        this.dir = "";
        this.name = "";
        this.type = "";
        this.size = "";
        this.meta = "";
        if (typeof(name) == 'undefined') {
            name = path.basename(dir);
            dir = path.dirname(dir);
        }
        this.refresh(root, dir, name);
    }

    // File data
    //
    //

    /**
     * Refreshes internal data about file
     *
     * @param  {path}   root = this.root mounting root
     * @param  {path}   dir = this.dir   file internal path
     * @param  {string} name = this.name file name
     * @return {null}
     */
    refresh(root = this.root, dir = this.dir, name = this.name) {
        this.root = root;
        this.dir = dir;
        this.name = name;
        this.fullpath = path.join(this.root, this.dir, this.name);
        this.linkpath = encodeURIComponent(path.join(this.dir, this.name));

        this.exists = fs.existsSync(this.fullpath);
        if (this.exists) {
            this._getStats(this.fullpath); // get statistics
            this._getMeta(); // gets metadata
        } else {
            this.type = '';
            this.size = 0;
        }
    }

    /**
     * Get metadata out of file name.
     *
     * This procedure also verifies metadata.
     *
     * @return {null}
     */
    _getMeta() {
        if (this.type == 'f') {
            var aName = this.name.split('.'),
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
    }

    /**
     * Gets filesystem data of the file
     *
     * @param  {path} fullpath  filesystem fullpath of file
     * @return {null}           fills in internal data
     */
    _getStats(fullpath) {
        var stats = fs.statSync(fullpath);
        this.size = stats.size;
        this.type = stats.isFile() ? 'f' : 'd';
    }

    // File Operations
    //
    //

    /**
     * Generates a file from nothing
     *
     * @param  {closure} cb Result callback
     * @return {null}
     */
    touch(cb) {
        var fstream = fs.createWriteStream(this.fullpath, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true
        });
        fstream.write('Hello world!\n');
        fstream.end();
        this.refresh();
        cb(this);
    }

    /**
     * Renames the file
     *
     * @param  {path} newName new name for the file
     * @param  {closure} cb Result callback
     * @return {null}
     */
    rename(newName, cb) {
        if (this.type == 'f') {
            var from = this.fullpath,
                to = path.join(this.root, newName);
            fs.rename(from, to, (err) => {
                this.refresh(this.root, path.dirname(newName), path.basename(newName));
                cb(this);
            });
        } else {
            return new Error("Not implemented");
        }
    }

    /**
     * Deletes the file
     *
     * @param  {closure} cb Result callback
     * @return {null}
     */
    delete(cb) {
        if (this.type == 'f') {
            fs.unlink(this.fullpath, (err) => {
                if (err) return console.error(err);
                this.refresh();
                cb(this);
            });
        } else {
            return new Error("Not implemented");
        }
    }

}

// -----------------------------------------------------------------------------

var exports = module.exports = File;
