'use strict';

let logger = require(`${process.cwd()}/utils/logger`);
let utils = require(`${process.cwd()}/utils/utils`)
let model = require('./model');

let Boom = require('boom');

let type = 'author';

exports.getAllAuthors = function(req, res){
    logger.log("GET All Authors Controller");
    model.Author.find()
    .then(function(docs){
        logger.log(docs);
        let dataFormatted = [];
        docs.map(function(docFromDb){
            let doc = {
                type: type,
                id: docFromDb._id,
                attributes: docFromDb
            };
            books.push(doc);
        });
        res({data: dataFormatted});
    });
};

exports.postAuthor = function(req, res){
    logger.log("POST Author Controller");
    let request = {};
    if(req.payload.data)
        request = req.payload.data.attributes;
    let author = new model.Author(request);

    author.save(function(err, data) {
        if(err) {
            logger.warn(err.message);
            res(Boom.badRequest(err.message));
            return;
        }
        let attributes = {
            message: 'Document saved'
        };
        logger.log(data);
        // use a custom function from the utils file to avoid redundancy
        res(utils.formatJson(type, data._id, attributes));
    });
};

exports.getAuthor = function(req, res) {
    logger.log("GET Author by ID");

    model.Author.findById(req.params.id, 
        function(err, docFromDb){
            if(err){
                logger.warn(err.message);
                res(Boom.badRequest(err.message));
                return;
            }
            logger.log(docFromDb);
            res(utils.formatJson(type, docFromDb._id, docFromDb));
        }
    );
};

exports.updateAuthor = function(req, res) {
    logger.log("PUT Author Controller");
    let request = {};
    if(req.payload.data)
        request = req.payload.data.attributes;

    logger.log(request);
    model.Author.findByIdAndUpdate(req.params.id, request,
        function(err, docFromDb) {
            if(err) {
                logger.warn(err.message);
                res(Boom.badRequest(err.message));
                return;
            }
            let attributes = {
                message: 'Document updated'
            };
            logger.log(docFromDb);
            res(utils.formatJson(type, docFromDb._id, attributes));
        }
    );
};

exports.removeAuthor = function(req, res) {
    logger.log("DELETE Author Controller");

    model.Author.findByIdAndRemove(req.params.id, 
        function(err, data) {
            if(err) {
                logger.warn(err.message);
                res(Boom.badRequest(err.message));
                return;
            }
            let attributes = {
                message: 'Document deleted'
            };
            logger.log(data);
            res(utils.formatJson(type, data._id, attributes));
        }
    );
};