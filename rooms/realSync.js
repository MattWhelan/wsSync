/*
 * Copyright (c) 2013 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

/**
 * RealSync server
 */
var mongodb = require("mongodb"),
    q = require("q"),
    _ = require("underscore"),
    MongoClient = mongodb.MongoClient,
    MongoServer = mongodb.Server,
    ObjectID = mongodb.ObjectID,
    mongoClient = new  MongoClient(new MongoServer("localhost", 27017));

var db = q.ninvoke(mongoClient, "open").then(function(mongoClient){
    return mongoClient.db("realSync");
}, function(){
    console.error(err);
    process.exit(1);
});

module.exports = exports = function(socket){
    socket.on("create", function(cookie, url, data){
        db.then(function(db){
            var collection = db.collection(url);
            collection.insert(data, {safe: true}, function(err, docs){
                socket.emit("syncResponse", cookie, err, docs[0]);
            });
        });
    }).on("read", function(cookie, url){
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            if(!id){
                var cursor = collection.find();
                cursor.toArray(function(err, docs){
                    socket.emit("syncResponse", cookie, err, docs);
                });
            }else{
                collection.findOne({_id: ObjectID(id)}, function(err, doc){
                    socket.emit("syncResponse", cookie, err, doc);
                });
            }
        });
    }).on("update", function(cookie, url, data){
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            var update = _.omit(data, "_id");
            collection.update({_id: ObjectID(id)}, update, {safe: true}, function(err){
                socket.emit("syncResponse", cookie, err, data);
            });
        });
    }).on("delete", function(cookie, url){
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            collection.remove({_id: ObjectID(id)}, {safe: true}, function(err){
                socket.emit("syncResponse", cookie, err, null);
            });
        });
    });
};
