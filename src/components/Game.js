import React, { useState, useEffect } from 'react';


{/*function drawTrack(r) {
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, r, 0, 2 * Math.PI);
    ctx.stroke();
    
}

function drawTail(x, y, r, c, a) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.globalAlpha = a;    
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function Ball(fi, r, c, speeds, pathR) {
    this.fi = fi; 
    this.r = r;
    this.c = c;
    this.speeds = speeds;
    this.pathR = pathR;  

    this.distance=0; 

    this.dx = 1; 
    this.dy = 1; 

    this.draw = function () {
        ctx.globalAlpha = 1; 
       
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    this.frame = 0;
    this.speed = 0;  
    

    this.animate = function() {
        drawTrack(this.pathR);
        if (this.frame % 500 == 0){
            this.speed = this.speeds[this.frame/500];   
        }

        this.distance += this.speed; 

        this.fi += Math.PI*this.speed; 

        for (var i = 0; i < 10; i++) {
            var tailX = CANVAS_WIDTH/2 + this.pathR * (1+(i*this.speed)) * Math.cos(this.fi - i*3*Math.PI*this.speed); 
            var tailY = CANVAS_HEIGHT/2 + this.pathR * (1+(i*this.speed)) * Math.sin(this.fi - i*3*Math.PI*this.speed); 

            var tailR = (1 - (i/10)) * this.r;
            var tailA = 1 - (i/10); 
            
            drawTail(tailX, tailY, tailR, this.c, tailA); 
        }

        this.x = CANVAS_WIDTH/2 + pathR * Math.cos(this.fi); 
        this.y = CANVAS_HEIGHT/2 + pathR * Math.sin(this.fi); 

        this.draw(); 
        this.frame++; 
    }
}

var balls = []; 

var speeds = [
    [0.002, 0.003, 0.002, 0.004, 0.005],
    [0.001, 0.006, 0.005, 0.004, 0.003],
    [0.002, 0.006, 0.001, 0.002, 0.002],
    [0.003, 0.003, 0.002, 0.003, 0.005],
    [0.0005, 0.004, 0.002, 0.006, 0.001],
]

var colors = ['blue', 'black', 'red', 'yellow', 'green']; 
for (var i = 0; i < 5; i++){
    var ball = new Ball(Math.PI, 10, colors[i], speeds[i], 300-(i*22)); 
    balls.push(ball); 
}

function newPositions(){
    var positionsSave = [];
    for (var i = 0; i < positions.length; i++){
        positionsSave.push(positions[i]); 
    }
    var newPositions = positions.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    for (var i = 0; i < positionsSave.length; i++){
        if (positionsSave[i].c !== newPositions[i].c){

            console.log(positionsSave[i].c);
            console.log(newPositions[i].c); 
             
            positions = newPositions;
        }
    }
}

function Update() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    newPositions(); 
    for (var i = 0; i < 5; i++){
       balls[i].animate();  
    }
    requestAnimationFrame(Update); 
}
positions = balls; 
Update(); 
*/}
export function Game(props) {
  
    const [width, setWidth] = useState(1200);
    const [height, setHeight] = useState(700);
    const [bgColor, setbgColor] = useState("#cccccc")
    
    useEffect(() => {
        let c = document.getElementById("canvas");
        let ctx = c.getContext("2d");
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);


        const CANVAS_WIDTH = canvas.width; 
        const CANVAS_HEIGHT = canvas.height; 

        var positions;
    })

    return <div className="canvas-wrapper">
        <canvas id="canvas" width={width} height={height}></canvas>
        <p id="1"> </p>
        <p id="2"> </p>
        <p id="3"> </p>
        <p id="4"> </p>
        <p id="5"> </p>
    </div>
}
