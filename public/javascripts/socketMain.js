require(["io", "realSync", "backbone"], function(io, realSync, Backbone){
    var socket = io.connect('http://localhost:3000');
//    socket.on('pong', function (data) {
//        console.log("ponged", data);
//    }).on('ready', function(data){
//        console.log("socket ready", data);
//        socket.emit("ping", {foo: "bar"});
//    });

    realSync("/sync");

    var Test = Backbone.Model.extend({
        idAttribute: "_id",
        "urlRoot": "test"
    });

    var testModel = new Test();
    testModel.save({
        "foo": "bar",
        "obj": {
            "fred": "wilma",
            "barney": "betty"
        }
    }, {
        success: function(model, response){
            console.log("saved", response, model);

            model.save({"foo": "baz"}, {
                success: function(model, response){
                    console.log("updated", response, model);
                }
            });
        }
    });
});
