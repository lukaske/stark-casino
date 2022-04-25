import React, { useState, useEffect } from 'react';
import Image2 from './stark.png'

export function Game(props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPageLoaded, setIsPageLoaded] = useState(false); //this helps
    const [speeds, setSpeeds] = useState(props.speeds)
    const [triggerUpdate, setTriggerUpdate] = useState(0)

    useEffect(() => {
        setIsLoaded(true);
    }, []);
    
    useEffect(() => {
        if (isLoaded) {
            setIsPageLoaded(true);
        }
    }, [isLoaded]);

    useEffect(() => {
        console.log("got trigger")
        if (isPageLoaded && speeds && props.trigger != 0){
            if (props.trigger != triggerUpdate){
                StartGame(speeds); 
                setTriggerUpdate(props.trigger)
            }
            console.log("got trigger2")

        }
    }, [props])
    
    function StartGame(speeds){    
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
    
        var starknet2 = new Image();
        starknet2.src = 'https://i.ibb.co/7R7Qb4f/stark.png';
    
        const CANVAS_WIDTH = canvas.width; 
        const CANVAS_HEIGHT = canvas.height;
    
     
        var positions; 
        var balls = [];
        var stardust = [];
        var stardustCount = 0; 
    
        function drawTrack(r){
            ctx.beginPath();
            ctx.strokeStyle = '#BDDF27'; 
            ctx.arc(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, r, 0, 2 * Math.PI);
            ctx.stroke();
            
        }
    
        function drawTail(x, y, r, c, a){
            ctx.beginPath();
            ctx.fillStyle = c;
            ctx.globalAlpha = a;    
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    
        function Stardust(id, startx, starty, endx, endy, r, c, time, alpha = 1){
            this.id = id; 
            this.startx = startx; 
            this.starty = starty;
            this.endx = endx;   
            this.endy = endy;  
            this.x = startx; 
            this.y = starty; 
            this.r = r; 
            this.c = c; 
            this.time = time; 
            this.animation = true; 
            // this.alpha = (Math.random() * (1 - 0.4) + 0.4).toFixed(4);
            this.alpha = alpha; 
            
    
            this.draw = function () {
                // this.alpha = (this.alpha - 0.5/this.time).toFixed(4); 
                // console.log(this.alpha); 
                ctx.globalAlpha = this.alpha; 
                ctx.beginPath();
                ctx.fillStyle = this.c;
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
            
            }
    
            this.animate = function() {
                if (Math.abs(this.x - this.startx) > Math.abs(this.endx - this.startx) ){
                    this.animation = false; 
                }
    
                if (this.animation){
                    this.x -= (this.startx-this.endx)/this.time; 
                    this.y -= (this.starty-this.endy)/this.time; 
                    this.draw();
                }
                else{
    
                    // stardust = stardust.filter(function( obj ) {
                    //     return obj.id !== this.id;
                    // });
                }
            }
        }
    
    
        function Ball( fi, r, c, speeds, pathR) {
            this.fi = fi; 
            this.r = r;
            this.c = c;
            this.speeds = speeds;
            this.pathR = pathR;  
            this.animation = true;
            this.nextStartdust = 10;  
    
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
                if (this.animation){
    
                    //change speeds
                    if (this.frame % 500 == 0){
                        this.speed = this.speeds[this.frame/500];   
                    }
        
                    this.distance += this.speed;
                    
                    //stop animation at finish, number is 2 * laps
                    if (this.distance >= 6){        
                        console.log('end'); 
        
                        this.animation = false; 
                    }
        
                    this.fi += Math.PI*this.speed; 
                    
                    //draw tails
                    // for (var i = 0; i < 10; i++){
                    //     var tailX = CANVAS_WIDTH/2 + this.pathR * (1+(i*this.speed)) * Math.cos(this.fi - i*3*Math.PI*this.speed); 
                    //     var tailY = CANVAS_HEIGHT/2 + this.pathR * (1+(i*this.speed)) * Math.sin(this.fi - i*3*Math.PI*this.speed); 
        
                    //     var tailR = (1 - (i/10)) * this.r;
                    //     var tailA = 1 - (i/10); 
                        
                    //     drawTail(tailX, tailY, tailR, this.c, tailA); 
                    // }
    
                    //draw stardust 
                    
                    if (this.nextStartdust == 0){
                        var sdR = Math.round(Math.random() * 5); 
                        var rand = (Math.random() * (1.05 - 0.95) + 0.95).toFixed(4); 
                        var endx = CANVAS_WIDTH/2 + this.pathR * rand * Math.cos(this.fi - i*3*Math.PI*this.speed);
                        var endy = CANVAS_HEIGHT/2 + this.pathR * rand * Math.sin(this.fi - i*3*Math.PI*this.speed);
    
                        if (stardustCount%20 != 0){
                            var sd = new Stardust(stardustCount, this.x, this.y, endx, endy, sdR, this.c, (Math.random() * (30 - 20) + 20).toFixed(4));
                            stardustCount++; 
                            stardust.push(sd); 
                            this.nextStartdust = Math.round(Math.random()*3); 
                        }else{
                            var sd = new Stardust(stardustCount, this.x, this.y, Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT, sdR, this.c, (Math.random() * (1000 - 800) + 800).toFixed(4), (Math.random() * (0.6 - 0.4) + 0.4).toFixed(4));
                            stardustCount++; 
                            stardust.push(sd); 
                            this.nextStartdust = Math.round(Math.random()*3); 
                        }
                        
                        
                    }
                    
                    if(this.nextStartdust < 0 ){
                        this.nextStartdust = - this.nextStartdust; 
                    }
    
                    //draw dot 
                    this.x = CANVAS_WIDTH/2 + pathR * Math.cos(this.fi); 
                    this.y = CANVAS_HEIGHT/2 + (pathR * Math.sin(this.fi)); 
        
                    this.draw(); 
                    this.frame++; 
                    this.nextStartdust--; 
                }
    
                else{
                    this.draw(); 
                }
            }
        }
    
       
    
        
        var colors = ['blue', 'white', 'red', 'yellow', 'green']; 
        for (var i = 0; i < colors.length; i++){
            var ball = new Ball(Math.PI, 10, colors[i], speeds[i], 300-(i*22)); 
            balls.push(ball); 
        }
    
        // var ball = new Ball(Math.PI, 10, 'blue',  [0.002, 0.003, 0.002, 0.004, 0.005], 300); 
        // balls.push(ball); 
    
        function newPositions(){
    
            var newPositions = positions.sort((a, b) => (a.distance >= b.distance) ? 1 : -1);
            var first = document.getElementById('1'); 
            first.textContent = '1. ' + newPositions[4].c; 
            var second = document.getElementById('2'); 
            second.textContent = '2. ' + newPositions[3].c; 
            var third = document.getElementById('3'); 
            third.textContent = '3. ' + newPositions[2].c;
            var fourth = document.getElementById('4'); 
            fourth.textContent = '4. ' + newPositions[1].c;
            var fifth = document.getElementById('5'); 
            fifth.textContent = '5. ' + newPositions[0].c;
            // for (var i = 0; i < newPositions.length; i++){
                
            
                // console.log(positionsSave[i].c);
                // console.log(newPositions[i].c); 
                // if (positionsSave[i].c != newPositions[i].c){
    
                //     console.log(positionsSave[i].c);
                //     console.log(newPositions[i].c); 
                    
                //     positions = newPositions;
                //     // console.log(positions); 
                // }
    
            // }
    
            // if (!newPositions.every(function(value, index) { return value === positionsSave[index]})){
            //     console.log(newPositions);
            // }
            
        }
    
        function Update() {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
            ctx.font = "30px Arial";
            ctx.fillStyle = "#ff4f0aff";
            ctx.fillText("START/FINISH", 70, 360);  
            ctx.beginPath();
            ctx.strokeStyle = "#ff4f0aff";
            ctx.moveTo(290, 350);
            ctx.lineTo(400, 350);
            ctx.stroke();
    
            ctx.drawImage(starknet2, CANVAS_WIDTH/2-75, CANVAS_HEIGHT/2-75, 150, 150);
            newPositions(); 
    
            for (var i = 0; i < stardust.length; i++){
                stardust[i].animate(); 
            }
    
            for (var i = 0; i < balls.length; i++){
                balls[i].animate();  
            }
            
            // balls[0].animate(); 
            requestAnimationFrame(Update); 
        }
        positions = balls; 
        Update(); 
    }

    return(
        <>
        <div>{props.trigger}</div>
        <canvas id="canvas" width="1200" height="700"></canvas>
        <div style={{ display : "flex" }}>
        <p id="1"> </p>
        <p id="2"> </p>
        <p id="3"> </p>
        <p id="4"> </p>
        <p id="5"> </p>
        </div>
        </>
    )     

}
