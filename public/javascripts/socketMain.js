require(["io"], function(io){
    var socket = io.connect('http://localhost:3000');
    socket.on('pong', function (data) {
        console.log("ponged", data);
    }).on('ready', function(data){
        console.log("socket ready", data);
        socket.emit("ping", {foo: "bar"});
    });
});

require(["jquery", "underscore", "backbone"], function($, _, Backbone){
});

