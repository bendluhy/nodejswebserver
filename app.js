var express = require('express');
var app = express();
var path  = require("path");
const session = require('express-session')
var admin = require("firebase-admin");
var bodyparser = require("body-parser")


admin.initializeApp({
  credential: admin.credential.cert("key.json"),
  databaseURL: "https://benji-s-webserver-database-default-rtdb.firebaseio.com"
});
db = admin.database();
var port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/static'));
app.use(session({
    name: "benjicookie",
    secret: "ALoghsdgojnAJN",
    resave: false,
    saveUninitialized: false
}))
app.use(bodyparser.urlencoded({ extended: false }))
// set the home page route
app.get('/', function(req, res) {
    res.render("home");
});
app.get('/blackjack', function (req, res) {
    req.session.user = {
        test: "a"
    }
    console.log(req.session.user.test)
    res.render("blackjack");
})
app.get("/login", function (req,res) {
    res.render("login");
})
app.post("/login",function(req,res){
    var username = req.body.username
    var password = req.body.password
        
})
app.get("/games",function (req,res) {
    res.render("games")
})
app.get("/dev",function (req,res) {
    res.render("dev")
})
app.get("/signup",function (req,res) {
    res.render("signup")
})
app.get("/music/request",function (req,res) {
    res.render("games")
})
app.get("/music",function (req,res) {
    console.log(database.ref("/Users/bendluhy/password").get())
    res.render("music")
})
app.listen(port, function() {
    console.log('Webserver is running on http://localhost:' + port);
});