var loadtest = require("loadtest");

var options = {
    url: "http://localhost:8000",
    maxRequests: 10000,
    concurrency: 100,
    headers: {
        "Accept": "application/json"
    },
    quiet: false
};

loadtest.loadTest(options, function(error, result) {
    if (error) {
        return console.error("Got an error: %s", error);
    }
    console.log("Tests run successfully");
    console.log(result);
});