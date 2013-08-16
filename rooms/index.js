/*
 * Copyright (c) 2013 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

/**
 * default room
 */

module.exports = exports = function connectHandler(socket){
    socket.emit("ready", { message: "socket is ready"});
    socket.on("ping", function(data){
        console.log("pinged", data);
        socket.emit("pong", data);
    });
};