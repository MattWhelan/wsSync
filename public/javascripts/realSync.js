/**
 */
define(["jquery", "underscore", "backbone", "io"], function($, _, Backbone, io){

    return function(socketOrUrl){
        //This manages requests
        function RequestManager(){
            var requests = {},
                seq = 0;

            function makeRequest(){
                var cookie = "request_" + (seq++),
                    request = new $.Deferred();
                request.cookie = cookie;
                requests[cookie] = request;
                return request;
            }

            function getRequest(cookie){
                return requests[cookie];
            }

            function removeRequest(cookie){
                delete requests[cookie];
            }

            this.request = makeRequest;
            this.getRequest = getRequest;
            this.removeRequest = removeRequest;
        }

        //This is the new Backbone.sync implementation
        function realSync(method, model, options){
            //Parse params
            var url = options.url || _.result(model, "url");
            var data = options.data || options.attrs || model.toJSON(options);

            //set up the request promise and tracking cookie
            var request = requestManager.request(),
                requestPromise = request.promise(),
                cookie = request.cookie;

            requestPromise.then(options.success, options.error);
            requestPromise.then(function(response){
                model.trigger("sync", model, response, options);
            }, function(){
                model.trigger("error", model, requestPromise, options);
            });

            //Make the sync request
            socket.emit(method, cookie, url, data);

            //Trigger the request event
            model.trigger("request", model, requestPromise, options);
            return requestPromise;
        }


        //Start it up
        var requestManager = new RequestManager(),
            socket = typeof socketOrUrl == "string" ? io.connect(socketOrUrl) : socketOrUrl;

        socket.on("syncResponse", function(cookie, err, data){
            var request = requestManager.getRequest(cookie);
            if(!request){
                console.error("No request for cookie: %s", cookie);
            }else{
                if(err){
                    console.error("Request for cookie %s failed: ", cookie, err);
                    request.reject(err);
                }else{
                    request.resolve(data);
                }
                requestManager.removeRequest(cookie);
            }
        });

        realSync.origSync = Backbone.sync;
        Backbone.sync = realSync;
    };
});
