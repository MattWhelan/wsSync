/**
 */
define(["jquery", "underscore", "backbone", "io"], function($, _, Backbone, io){

    return function(socketOrUrl){
        //This manages requests, which are promises
        function RequestManager(){
            var requests = {},
                seq = 0;

            //Construct a new request and return it
            function makeRequest(){
                var cookie = "request_" + (seq++),
                    request = new $.Deferred();
                request.cookie = cookie;
                requests[cookie] = request;
                return request;
            }

            //Get a request by cookie
            function getRequest(cookie){
                return requests[cookie];
            }

            //Remove a request by cookie, so they don't just stick around eating memory
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
            var url = options.url || _.result(model, "url"); //url is used to indicate type and ID, nothing more.
            var data = options.data || options.attrs || model.toJSON(options);

            //set up the request promise and tracking cookie
            var request = requestManager.request(),
                requestPromise = request.promise(),
                cookie = request.cookie;

            requestPromise.then(options.success, options.error);

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
        //Undo will restore the original sync method.
        realSync.undo = function(){
            this.sync = this.origSync;
            delete this.origSync;
        };
        //Install the realSync implementation
        Backbone.sync = realSync;
    };
});
