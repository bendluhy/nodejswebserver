var express = require('express');
var app = express();
var path  = require("path");
const session = require('express-session')
var admin = require("firebase-admin");
var bodyparser = require("body-parser");
const { render } = require('ejs');


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




app.get('/', function(req, res) {
    var ref = db.ref("/Server")
    ref.on("value", function(snapshot) {
    res.render("home",{
        announcement: snapshot.val().announcement,
        Message: snapshot.val().message
        });
    })
});
app.get('/blackjack', function (req, res) {
    
    if (req.session.user)
    {
        res.render("blackjack")
    }
    else
    {
        res.redirect("/login")
    }
})
app.get("/login", function (req,res) {
    res.render("login");
})
app.post("/login",function(req,res){
    var username = req.body.username
    var password = req.body.password
    ref = db.ref("/Users/" + username);
    ref.on("value", function(snapshot) {
        if(snapshot.val() == null)
        {
            res.render("boiler",{
                title: "Error",
                header: "An Error Occured",
                subhead: "No account under the name \"" + username + "\" exists."

            })
        }
        else if (snapshot.val().password == password)
        {
            req.session.user = 
            {
                username: snapshot.val().username,
                password: snapshot.val().password,
                balance: snapshot.val().balance,
                nickname: snapshot.val().name,
                access: snapshot.val().access
            }
            loggedIn = true;
            res.redirect("/user/home")
        }
        else if (snapshot.val().password != password)
        {
            res.render("boiler",{
                title: "Error",
                header: "An Error Occured",
                subhead: "Your password is incorrect"
            })
        }
        else
        {
            res.render("boiler",{
                title: "Error",
                header: "An Error Occured",
                subhead: "Contact Benji as of this should not happen."
            })  
        }
        
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
        
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
    res.render("songRequest")
})
app.get("/user/home",function(req,res)
{
    if (req.session.user)
    {
        res.render("userHome",req.session.user)
    }
    else
    {
        res.redirect("/login")
    }
})

app.get("/music",function (req,res) {
    res.render("music")
})
app.get("/parker",function(req,res)
{
    res.render("parker");
})
app.get("/about",function(req,res){
    var today = new Date();
    res.render("about",{
        date: (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear()
    })
})

app.listen(port, function() {
    console.log('Webserver is running on http://localhost:' + port);
});