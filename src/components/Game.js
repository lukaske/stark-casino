import React, { useState, useEffect } from 'react';


export function Game(props) {
  
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(500);
    const [bgColor, setbgColor] = useState("#cccccc")
    
    useEffect(() => {
        let c = document.getElementById("canvas");
        let ctx = c.getContext("2d");
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    })

    return <div className="canvas-wrapper">
        <canvas id="canvas" width={width} height={height}></canvas>
    </div>
}
