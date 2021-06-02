var express = require('express');
var app = express();
var path  = require("path");
const session = require('express-session')
var admin = require("firebase-admin");
var bodyparser = require("body-parser");
var io = require("socket.io")(3000, {
    cors: {
		origin: true, // true means to use any frontend.
	},
})
const { render } = require('ejs');

const users = {}
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
        res.render("blackjack",{user: req.session.user.username})
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
                access: snapshot.val().access,
                isDev: snapshot.val().isDev
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
    if (req.session.user)
    {
        if (req.session.user.isDev)
        {
            ref = db.ref("/Server")
            ref.on("value", function(snapshot) {
            res.render("dev",
                {
                    announcement: snapshot.val().announcement,
                    message: snapshot.val().message
                })
            })
        }
        else
        {
            res.render("boiler",{
                title: "Server - Dev Error",
                header: "You are not a developer",
                subhead: "Contact Benji if you think this is an error"
            })
        }
    }
    else
    {
        res.redirect("/login?origin=/dev")
    }
})
app.post("/dev",function(req,res)
{
    var ref = db.ref("/Server/")
    if (req.body.announcement != "")
    {
        var child = ref.child("announcement")
        child.set(req.body.announcement)
    }
    if (req.body.message != "")
    {
        var child = ref.child("message")
        child.set(req.body.message)
    }
    res.redirect("/dev")
})
app.get("/signup",function (req,res) {
    res.render("signup")
})
app.post("/signup", function(req,res)
{
    var ref = db.ref("/Users/")
    var child = ref.child(req.body.username)
        child.set({
            "username": req.body.username,
            "password": req.body.password,
            "name": req.body.nickname,
            "balance": 0,
            "isDev": false,
            "access": "user"
            })
            res.render("boiler",{
                title: "Signed Up",
                header: "Thank You, " + req.body.username + "!",
                subhead: "Your account has been created, go to the home page and login to login!"
            })
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
        var ref = db.ref("/User/"+req.session.user.username + "/")
        ref.on("value", function(snapshot) {
            res.render("userHome",
            {
                username: req.session.user.username,
                balance: req.session.user.balance,
                access: req.session.user.access,
                nickname: req.session.user.nickname
            })
        })
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
app.get("/games/run",function(req,res)
{
    res.render("run3")
})
app.get("/amongus",function(req,res)
{
    res.render("amongus")
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
app.get("/chat",function(req,res){
    res.render("chat")







})
app.get("/games/swingtriangle",function(req,res)
{
    res.render("swingtriangle")
})
app.get("/games/chess",function(req,res)
{
    res.render("chess")
})
/*
*KEEP AS LAST ROUTE
*404 ROUTE
*/
io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  })
app.get("/howtocode",function(req,res)
{
    res.render("howtocode")
})
app.get("*",function(req,res)
{
    res.status(404).render("boiler",{
        header: "Page Not Found",
        title: "Server - Page Not Found",
        subhead: "Sorry I Fidn't Find A Page Here"
    })
})
app.listen(port, function() {
    console.log('Webserver is running on http://localhost:' + port);
});