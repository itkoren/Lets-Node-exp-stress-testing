var http = require("http");
var express = require("express");
var morgan = require("morgan");
var errorhandler = require("errorhandler");
var responseTime = require("response-time");

var app = express();

if ("development" === app.get("env")) {
    // Gets called in the absence of NODE_ENV too!
    app.use(function (req, res, next) {
        // you always log
        console.error(" %s %s ", req.method, req.url);
        next();
    });
    app.use(morgan({ format: "dev", immediate: true }));
    app.use(errorhandler({ dumpExceptions: true, showStack: true }));
}
else if ("production" === app.get("env")) {
    app.use(errorhandler());
}

// all environments
app.set("port", process.env.PORT || 8000);
app.set("ip", process.env.IP || "0.0.0.0");

// Add the responseTime middleware
app.use(responseTime());

app.get("/", function(req, res) {
    res.format({
        "text/plain": function() {
            res.send("welcome");
        },
        "text/html": function() {
            res.send("<b>welcome</b>");
        },
        "application/json": function() {
            res.json({ message: "welcome" });
        },
        "default": function() {
            res.send(406, "Not Acceptable");
        }
    });
});

app.get("/leak", function(req, res) {
    var srcObj = null;

    var switchObj = function () {
        var originalObj = srcObj;

        var haveOriginal = function () {
            if (originalObj) {
                console.log("have original");
            }
        };

        srcObj = {
            longStr: new Array(10000000000).join("*"),
            someMethod: function () {
                console.log("someMethod");
            }
        };

        originalObj = null;
    };

    switchObj();

    res.send("Leaked");
});

var server = http.createServer(app).listen(app.get("port"), function(){
    console.log("Express Server listening on port", server.address().port);
});