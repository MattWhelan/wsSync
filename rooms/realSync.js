/*
 * Copyright (c) 2013 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

/**
 * TODO: doc comment here
 */
module.exports = exports = function(socket){
    socket.on("create", function(cookie){
        console.log("create", arguments);
        socket.emit("syncResponse", cookie, null, "test");
    }).on("read", function(cookie){
        console.log("read", arguments);
        socket.emit("syncResponse", cookie, null, "test");
    }).on("update", function(cookie){
        console.log("update", arguments);
        socket.emit("syncResponse", cookie, null, "test");
    }).on("delete", function(cookie){
        console.log("delete", arguments);
        socket.emit("syncResponse", cookie, null, "test");
    });
};