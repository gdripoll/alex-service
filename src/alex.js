/* jshint esversion:6 */

var express = require('express'),
    router = express.Router(),
    Dir = require('./alex/dir'),
    File = require('./alex/file');

/**
 * Alexandria
 */
class Alex {

    /**
     * constructor - description
     *
     * @return {type}  description
     */
    constructor() {
        this.router = express.Router();

    }

    /**
     * routes - description
     *
     * @return {type}  description
     */
    routes() {
        this.router
            .use(this.logger)
            .get('/', this.home)
            .get('/about', this.about)
            .get('/config', this.config)
            .get(['/list/?', '/list/*'], this.list)
            .get('/get/*', this.get)
            .get('/ren/:from/:to', this.rename)
            .get('/touch/:file', this.touch)
            .get('/rm/:file', this.delete);
        return this.router;
    }

    /**
     * logger - description
     *
     * @param  {type} req  description
     * @param  {type} res  description
     * @param  {type} next description
     * @return {type}      description
     */
    logger(req, res, next) {
        // console.log('Time: ', Date.now());
        next();
    }

    /**
     * home - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    home(req, res) {
        res.render('alex/index', {
            title: 'Alexandria Server'
        });
    }

    /**
     * about - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    about(req, res) {
        res.send({
            'title': 'Alexandria list',
            'apis': {
                '/': 'Wellcome screen',
                '/about': 'An about screen',
                '/list/:path': 'Lists a path',
                '/get/:path': 'downloads a file'
            }
        });
    }

    /**
     * config - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    config(req, res) {
        res.send(req.app.get('config'));
    }

    /**
     * list - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    list(req, res) {
        var dir = new Dir(req.app.get('config').fs.root);
        var path = req.params[0] ? req.params[0] : "";
        dir.getDir(path, (files) => {
            res.send(files);
        });
    }

    /**
     * get - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    get(req, res) {
        var file = new File(req.app.get('config').fs.root, req.params[0]);
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
    }

    /**
     * rename - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    rename(req, res) {
        var dir = req.app.get('config').fs.root,
            file = new File(dir, decodeURIComponent(req.params.from));

        file.rename(decodeURIComponent(req.params.to), (f) => {
            res.status(200).send(f);
        });
    }

    /**
     * touch - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    touch(req, res) {
        var dir = req.app.get('config').fs.root,
            file = new File(dir, decodeURIComponent(req.params.file));

        file.touch((f) => {
            res.status(200).send(f);
        });
    }

    /**
     * delete - description
     *
     * @param  {type} req description
     * @param  {type} res description
     * @return {type}     description
     */
    delete(req, res) {
        var dir = req.app.get('config').fs.root,
            file = new File(dir, decodeURIComponent(req.params.file));

        file.delete((f) => {
            res.status(200).send(f);
        });
    }
}

// -----------------------------------------------------------------------------
// Init
module.exports = Alex;
