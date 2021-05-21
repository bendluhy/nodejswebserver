var express = require('express');
var app = express();
var path  = require("path");
const session = require('express-session')

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


app.use(express.static(__dirname + '/static'));

// set the home page route
app.get('/', function(req, res) {

    res.sendfile('views/home.html');
});
app.get('/blackjack', function (req, res) {
    res.sendfile("views/blackjack.html");
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});