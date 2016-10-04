/* jshint esversion:6 */

var exports = module.exports = function(dir, name) {

    this.name = name;
    this.fullpath = dir + ((dir[dir.length - 1] == '/') ? '' : '/') + name;

    stats = fs.statSync(this.fullpath);
    this.type = stats.isFile() ? 'f' : 'd';
    this.size = stats.size;


    if (this.type == 'f') {
        this.aName = name.split('.');

        // verificaciones
        this.meta = {
            'errors': []
        };
        if (this.aName.length < 4) this.meta.errors.push("Not enough dots");
        else if (this.aName.length < 4) this.meta.errors.push("Too many dots");

        this.meta.author = this.aName[0];
        this.meta.title = this.aName[1];
        this.meta.lang = this.aName[2];
        if (this.meta.lang.length != 3) this.meta.errors.push("Invalid language");

        this.meta.ext = this.aName[3];

    }

};
