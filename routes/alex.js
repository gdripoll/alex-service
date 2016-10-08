/* jshint esversion:6 */

var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// -----------------------------------------------------------------------------

/**
 * Saludo
 */
router.get('/', function(req, res) {
    res.render('alex/index', {
        title: 'Alexandria Server'
    });
});
/**
 * Sobre nosotros
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
/**
 * Configuracion
 */
router.get('/config', function(req, res) {
    res.send(req.app.get('config'));
});

// -----------------------------------------------------------------------------

/**
 * Lista un directorio
 */
router.get(['/list/?','/list/*'], function(req, res) {
    var adir = require('./alex/dir');
    var dir = req.app.get('config').fs.root;
    var path = req.params[0] ? req.params[0] : "";
    var files = adir.getDir(
        dir, path,
        function(files) {
            console.log(':: LIST : ' + req.params[0]);
            res.send(files);
        }
    );
});

/**
 * Obtiene un archivos
 */
router.get('/get/*', function(req, res) {
    var file = require('./alex/file');

    var f = new file(req.app.get('config').fs.root, req.params[0]);
    if (f.type == 'f') {
        var fileName = req.app.get('config').fs.root + '/' + req.params[0];
        res.sendFile(fileName, function(err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', fileName);
            }
        });
    } else {
        res.status(404).end("Not a file.");
    }

});

// -----------------------------------------------------------------------------

module.exports = router;
