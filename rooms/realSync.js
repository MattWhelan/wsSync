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
        console.log("create", arguments);
        db.then(function(db){
            var collection = db.collection(url);
            try{
                collection.insert(data, {safe: true}, function(err, docs){
                    if(err) throw err;
                    socket.emit("syncResponse", cookie, null, docs[0]);
                });
            }catch(err){
                console.error(err);
                socket.emit("syncResponse", cookie, err);
            }
        });
    }).on("read", function(cookie, url, data){
        console.log("read", arguments);
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            try{
                if(!id){
                    var cursor = collection.find();
                    cursor.toArray(function(err, docs){
                        if(err) throw err;
                        socket.emit("syncResponse", cookie, null, docs);
                    });
                }else{
                    collection.findOne({_id: ObjectID(id)}, function(err, doc){
                        if(err) throw err;
                        socket.emit("syncResponse", cookie, null, doc);
                    });
                }
            }catch(err){
                console.error(err);
                socket.emit("syncResponse", cookie, err);
            }
        });
    }).on("update", function(cookie, url, data){
        console.log("update", arguments);
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            try{
                var update = _.omit(data, "_id");
                collection.update({_id: ObjectID(id)}, update, {safe: true}, function(err){
                    if(err) throw err;
                    socket.emit("syncResponse", cookie, null, data);
                });
            }catch(err){
                console.error(err);
                socket.emit("syncResponse", cookie, err);
            }
        });
    }).on("delete", function(cookie, url, data){
        console.log("delete", arguments);
        db.then(function(db){
            var urlParts = url.split("/"),
                type = urlParts[0],
                id = urlParts[1],
                collection = db.collection(type);
            try{
                collection.remove({_id: ObjectID(id)}, function(err){
                    if(err) throw err;
                    socket.emit("syncResponse", cookie, null, null);
                });
            }catch(err){
                console.error(err);
                socket.emit("syncResponse", cookie, err);
            }
        });
    });
};
