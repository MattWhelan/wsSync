require(["realSync", "backbone"], function(realSync, Backbone){
//    var socket = io.connect('http://localhost:3000');
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

    var testModel = new Test(),
        start = +new Date();
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
                    var secondCopy = new Test({
                        _id: model.id
                    });
                    secondCopy.fetch({
                        success: function(model, response){
                            console.log("fetched", response, model);
                            model.destroy({
                                success: function(model){
                                    console.log("destroyed, " + (new Date() - start), model);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
