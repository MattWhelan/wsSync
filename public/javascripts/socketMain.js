require(["io", "realSync", "backbone"], function(io, realSync, Backbone){
    var socket = io.connect('http://localhost:3000');
    socket.on('pong', function (data) {
        console.log("ponged", data);
    }).on('ready', function(data){
        console.log("socket ready", data);
        socket.emit("ping", {foo: "bar"});
    });

    realSync("/sync");

    var testModel = new Backbone.Model(null, {
        url: "test"
    });
    testModel.save({
        "foo": "bar",
        "obj": {
            "fred": "wilma",
            "barney": "betty"
        }
    }, {
        success: function(model, response){
            console.log("saved", response);
        }
    });
});
