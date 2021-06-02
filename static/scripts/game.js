
//GET CANVAS
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
//
ctx.beginPath();

ctx.rect(50,50,100,100);
ctx.fillStyle = "red";

var x = 50;
var y = 50;
ctx.fill();

ctx.beginPath()


document.addEventListener('keydown', function(event) {
    if(event.keyCode == 68) {
        //RIGHT
        x+=20;
    }
    if(event.keyCode == 65) {
        //LEFT
        x-=20;
    }
    if(event.keyCode == 83)
    {
        //DOWN
        y-=20
    }
    if (event.keyCode == 87)
    {
        //UP
        y+=20;
    }
    ctx.clearRect(0,0,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(x,y,100,100);
    ctx.fillStyle = "red";
    ctx.fill();
});
