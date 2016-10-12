/* jshint esversion:6 */

var express = require('express'),
    router = express.Router();

/** @module alex */

// -----------------------------------------------------------------------------
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// -----------------------------------------------------------------------------

/**
 * router - Alex default message
 * @memberof alex
 * @function
 * @name root
 */
router.get('/', function(req, res) {
    res.render('alex/index', {
        title: 'Alexandria Server'
    });
});


/**
 * router - About us
 * @memberof alex
 * @function
 * @name about
 */
router.get('/about', function(req, res) {
    res.send({
        'title': 'Alexandria list',
        'apis': {
            '/': 'Wellcome screen',
            '/about': 'An about screen',
            '/list/:path': 'Lists a path',
            '/get/:path': 'downloads a file'
        }
    });
});
router.get('/config', function(req, res) {
    res.send(req.app.get('config'));
});

// -----------------------------------------------------------------------------
// dir management
router.get(['/list/?', '/list/*'], function(req, res) {
    var Dir = require('./alex/dir');
    var dir = new Dir(req.app.get('config').fs.root);
    var path = req.params[0] ? req.params[0] : "";
    dir.getDir(
        path,
        function(files) {
            console.log(':: LIST : ' + req.params[0]);
            res.send(files);
        }
    );

});
router.get('/get/*', function(req, res) {
    var fileClass = require('./alex/file');

    var file = new fileClass(req.app.get('config').fs.root, req.params[0]);
    console.log('[[file]]' + file);
    if (file.exists) {
        if (file.type == 'f') {
            res.sendFile(file.fullpath, function(err) {
                if (err) {
                    console.log('ERROR: ' + err);
                    res.status(err.status).end();
                } else {
                    console.log('Sent:', file.fileName);
                }
            });
        } else {
            res.status(404).send("Not a file.");
        }
    } else {
        res.status(404).send({
            file
        });
    }
});

// -----------------------------------------------------------------------------
// file management
router.get('/ren/:from/:to', function(req, res) {
    var fileClass = require('./alex/file'),
        dir = req.app.get('config').fs.root,
        file = new fileClass(dir, decodeURIComponent(req.params.from));

    file.rename(decodeURIComponent(req.params.to), (f) => {
        res.status(200).send(f);
    });
});
router.get('/touch/:file', function(req, res) {
    var File = require('./alex/file'),
        dir = req.app.get('config').fs.root,
        file = new File(dir, decodeURIComponent(req.params.file));

    file.touch((f) => {
        res.status(200).send(f);
    });
});
router.get('/rm/:file', function(req, res) {
    var fileClass = require('./alex/file'),
        dir = req.app.get('config').fs.root,
        file = new fileClass(dir, decodeURIComponent(req.params.file));

    file.delete((f) => {
        res.status(200).send(f);
    });
});

// -----------------------------------------------------------------------------
// Init
module.exports = router;
