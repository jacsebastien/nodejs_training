'use strict';

let logger = require(`${process.cwd()}/utils/logger`);
let utils = require(`${process.cwd()}/utils/utils`)
let model = require('./model');
// to create custom error messages compatible with hapi-json-api module
let Boom = require('boom');

let type = 'library';

exports.getAllLibraries = function(request, reply){
    logger.log("GET All Libraries Controller");
    model.find()
    .then(function(docs){
        logger.log(docs);
        let libraries = [];
        // manip to edit data to be in json api format
        docs.map(function(libraryFromDb){
            let library = {
                type: type,
                id: libraryFromDb._id,
                attributes: libraryFromDb
            };
            libraries.push(library);
        });
        reply({data: libraries});
    });
};

exports.postLibrary = function(req, res){
    logger.log("POST Library Controller");
    let request = {};
    if(req.payload.data)
        request = req.payload.data.attributes;
    let library = new model(request);

    library.save(function(err, data) {
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

exports.getLibrary = function(req, res) {
    logger.log("GET Library by ID");

    model.findById(req.params.id, 
        function(err, libraryFromDb){
            if(err){
                logger.warn(err.message);
                res(Boom.badRequest(err.message));
                return;
            }
            logger.log(libraryFromDb);
            res(utils.formatJson(type, libraryFromDb._id, libraryFromDb));
        }
    );
};

exports.updateLibrary = function(req, res) {
    logger.log("PUT Library Controller");
    let request = {};
    if(req.payload.data)
        request = req.payload.data.attributes;

    logger.log(request);
    model.findByIdAndUpdate(req.params.id, request,
        function(err, data) {
            if(err) {
                logger.warn(err.message);
                res(Boom.badRequest(err.message));
                return;
            }
            let attributes = {
                message: 'Document updated'
            };
            logger.log(data);
            res(utils.formatJson(type, data._id, attributes));
        }
    );
};

exports.removeLibrary = function(req, res) {
    logger.log("DELETE Library Controller");

    model.findByIdAndRemove(req.params.id, 
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