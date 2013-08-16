/*
 * Copyright (c) 2013 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

/**
 * Configure require.js
 */
require.config({
    baseUrl: "/javascripts",
    paths: {
        "jquery": "lib/jquery-2.0.3.min",
        "underscore": "lib/underscore-min",
        "backbone": "lib/backbone-min",
        "io": "/socket.io/socket.io"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "io": {
            exports: "io"
        }
    }
});