/* jshint esversion:6 */

var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
router.get('/', function(req, res) {
    res.render('alex/index', {
        title: 'Alexandria Server'
    });
});
router.get('/about', function(req, res) {
    res.send({
        'title': 'Alexandria list',
        'apis': {
            '/': 'Wellcome screen',
            '/about': 'An about screen'
        }
    });
});
router.get('/config', function(req, res) {
    res.send(req.app.get('config'));
});

// -----------------------------------------------------------------------------

//
// list
//
router.get('/list/*', function(req, res) {
    var adir = require('./alex/dir');
    var files = adir.getDir(
        req.app.get('config').fs.root,
        req.params[0],
        function(files) {
            res.send(files);
        }
    );
});




module.exports = router;
