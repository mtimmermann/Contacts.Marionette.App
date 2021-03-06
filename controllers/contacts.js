var db = require('mongojs').connect('localhost/contact-list', ['contacts']),
    $ = require('jquery');

module.exports.controllers = function(app) {

    app.get('/contacts', function(req, res) {
        var page = getIntParam(req.query.page);
        var pageSize = getIntParam(req.query.pageSize)
        var search = req.query.search;

        if (search) {
            db.contacts.find({'$or':[
                {'firstName':{'$regex':search, '$options':'i'}},
                {'lastName':{'$regex':search, '$options':'i'}}]},
                function(error, docs) {
                    if (error || !docs) {
                        // TODO: Logging
                        console.log(error);
                        res.statusCode = 500;
                        return res.send(JSON.stringify({
                            code: res.statusCode,
                            message: 'Server error',
                            description: 'More details about the error here' }));
                    } else {
                        return res.send(JSON.stringify({ data: docs }))
                    }
            });
        } else {

            $.when(getCountFunctionDefered()).done(function(nbDocs) {

                var sortBy = req.query.sort_by ? req.query.sort_by : 'lastName';
                var argOrder = req.query.order ? req.query.order : 'asc';
                var sortOrder = argOrder === 'desc' ? -1 : 1;
                var sortObj = {};
                sortObj[sortBy] = sortOrder;

                if (page && pageSize) {
                    var top = (page -1) * pageSize;
                    var start = top - pageSize;
                    if (start < nbDocs) {

                        // TODO: Determine how to ingore case with sort
                        return db.contacts.find().sort(sortObj).skip((page-1) * pageSize).limit(pageSize, function(err, docs) {
                            //res.json({ totalRecords: nbDocs, page: page, data: docs });
                            res.send(JSON.stringify({ totalRecords: nbDocs, page: page, data: docs }));
                        });
                    }

                    //return res.json({ totalRecords: nbDocs, page: page, data: [] });
                    return res.send(JSON.stringify({ totalRecords: nbDocs, page: page, data: [] }));
                } else {
                    return db.contacts.find().sort(sortObj, function(err, docs) {
                        //res.json({ totalRecords: nbDocs, data: docs });
                        res.send(JSON.stringify({ totalRecords: nbDocs, data: docs }));
                    });
                }
            });
        }
    });

    app.get('/contacts/:id', function(req, res) {

        db.contacts.findOne({ _id: db.ObjectId(req.params.id) }, function(err, doc) {
            if (doc) {
                return res.send(JSON.stringify(doc));
            } else if (err) {
                res.statusCode = 500;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Server error',
                    description: 'More details about the error here' }));
            } else {
                res.statusCode = 404;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Error 404: contact not found'}));
            }
        });
    });

    app.put('/contacts/:id', function(req, res) {

        var contactObj = req.body;
        contactObj._id = db.ObjectId(req.params.id);
        delete contactObj.id;

        db.contacts.save(contactObj, function(err, result) {
            if (err || result == null) {
                res.statusCode = 500;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Server error',
                    description: 'More details about the error here' }));
            } else if (result !== null && result === 0) {
                res.statusCode = 404;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Error 404: contact not found'}));
            } else {
                return res.send(JSON.stringify(contactObj));
            }
        });
    });

    app.post('/contacts', function(req, res) {

        var contactObj = req.body;
        delete contactObj.id;

        db.contacts.save(contactObj, function(err, doc) {
            if (err || !doc) {
                res.statusCode = 500;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Server error',
                    description: 'More details about the error here' }));
            } else {
                doc.id = doc._id;
                return res.send(JSON.stringify(doc));
            }
        });
    });

    app.delete('/contacts/:id', function(req, res) {

        db.contacts.remove({'_id': db.ObjectId(req.params.id)}, function(err, result) {
            if (err || result == null) {
                res.statusCode = 500;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Server error',
                    description: 'More details about the error here' }));
            } else if (result !== null && result === 0) {
                res.statusCode = 404;
                return res.send(JSON.stringify({
                    code: res.statusCode,
                    message: 'Error 404: contact not found'}));
            } else {
                return res.send(JSON.stringify({ IsSuccess: true }));
            }
        });
    });

    app.post('/uploader', function(req, res) {

        var path = 'pics/'

        // http://markdawson.tumblr.com/post/18359176420/asynchronous-file-uploading-using-express-and-node-js
        require('fs').rename(
            req.files.file.path,
            path + req.files.file.name,
            function(error) {
                if (error) {
                    console.log(error);
                    res.statusCode = 500;
                    res.json({
                        code: res.statusCode,
                        message: 'Uploading process failed'
                    });
                    return;
                }

                return res.json({
                    IsSuccess: true,
                    path: path + req.files.file.name
                });
            }
        );
    });


    // Helper methods
    function getIntParam(param) {
        if (typeof param === 'string' && (/^\d+$/).test(param)) {
            return parseInt(param, 10);
        }
        return null;
    }

    function getCountFunctionDefered() {
        var deferred = $.Deferred();
        db.contacts.count(function(error, nbDocs) {
            deferred.resolve(nbDocs);
        });
        return deferred.promise();
    }

}