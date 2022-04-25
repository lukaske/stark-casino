import React, { createRef } from 'react';
import CanvasDraw from "react-canvas-draw";


function submitImage(canvasRef) {
    let hash = require('object-hash')
    let secret = hash(canvasRef.current.getSaveData())
    console.log("secret: ", secret)
    canvasRef.current.clear()
}

export function Canvas(props) {
    const canvasRef = createRef();

    return <div className="canvas-wrapper">
        <CanvasDraw ref={canvasRef} canvasWidth={props.width} canvasHeight={props.height}/>
        <button onClick={() => submitImage(canvasRef)}>Submit image</button>
    </div>
}