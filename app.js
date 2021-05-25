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
        res.redirect("/login?origin=/blackjack")
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
            if (req.query.origin)
            {
                res.redirect(req.query.origin)
            }
            else
            {
                res.redirect("/user/home")
            }
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
    if (req.session.user)
    {
        res.render("songRequest")
    }
    else
    {
        res.redirect("/login?origin=/music/request")
    }
})
app.post("/music/request",function(req,res)
{
    //COPY LOGIN FROM ERROR REPORT
    if (req.session.user)
    {
        var error = false;
        var today = new Date();
        var song = req.body.song
        var link = req.body.songLink
        var artist = req.body.artist
        var ref = db.ref("/Server/music/requests/")
        if (song == "")
        {
            res.render("boiler",{
                header: "An Error Occured",
                title: "Error",
                subhead: "You did not enter a song name"
            })
            error = true;
        }
        if (link == "")
        {
            link = "No Link Submitted"
        }
        if (artist == "")
        {
            artist = "No Artist Submitted"
        }
        if (!error)
        {
            var child = ref.child(song)
            child.set({
                "Username": req.session.user.username,
                "Song": song,
                "Link":link,
                "Artist": artist,
                "Time": today.getHours() + ":" + today.getMinutes(),
                "Date": (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear()
                })
            res.render("boiler",{
                title: "Thank You",
                header: "Your song request has been submitted",
                subhead: "Thank You, " + req.session.user.username + "!"
            }) 
        }
    }
    else
    {
        res.redirect("/login?origin=/songrequest")
    }
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
app.get("/reporterror",function(req,res)
{
    if (req.session.user)
    {
        res.render("errorReport")
    }
    else
    {
        res.redirect("/login?origin=/reporterror")
    }
})
app.post("/reporterror",function(req,res)
{
    if (req.session.user)
    {
    var error = false;
    var today = new Date();
    var err = req.body.error
    var description = req.body.description
    var ref = db.ref("/Server/Errors/Reports/")
    if (err == "")
    {
        error = true;
    }
    if (error)
    {
        res.render("boiler",{
            title: "Error",
            header: "An Error Occured",
            subhead: "You did not enter an error"
        })
    }
    else if (!error)
    {
        var child = ref.child(err)
        child.set({
            "Username": req.session.user.username,
            "Error": err,
            "Description":description,
            "Time": today.getHours() + ":" + today.getMinutes(),
            "Date": (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear()
            })
            res.render("boiler",{
                title: "Thank You",
                header: "Your error has been submitted",
                subhead: "Thank You, " + req.session.user.username + "!"
            })
        }
    }
    else
    {
        
        res.redirect("/login?origin=/reporterror")
    }
})
app.post("/user/home",function(req,res)
{
    delete req.session.user;
    res.redirect("/")
})

app.listen(port, function() {
    console.log('Webserver is running on http://localhost:' + port);
});