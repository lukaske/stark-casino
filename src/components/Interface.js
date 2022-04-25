import { useState, createRef } from "react"
import { Button, Spacer, Select } from '@geist-ui/react'
import CanvasDraw from "react-canvas-draw";
import { pedersen } from "../pedersen";


function placeBet(canvasRef) {
    let hash = require('object-hash')
    let secret = hash(canvasRef.current.getSaveData())
    console.log("secret: ", secret)
    canvasRef.current.clear()
    console.log("pedersen: ", pedersen([100, 0]));
}

export function Interface(props) {
    const [horseNum, setHorseNum] = useState('1');
    const [hash, setHash] = useState("0x19fs232");
    const [bet, setBet] = useState("10");

    const canvasRef = createRef();

    
    return (
        <div className="wrapper">
            <div className="ui-wrapper">
                <div className="input-component">
                <Select placeholder="Choose your horse!" onChange={(val) => setHorseNum(val) }>
                    <Select.Option value="1">Horse 1</Select.Option>
                    <Select.Option value="2">Horse 2</Select.Option>
                    <Select.Option value="3">Horse 3</Select.Option>
                </Select>
                </div>

                <div className="input-component">
                <Select className="select" placeholder="Choose your bet!" onChange={(val) => setBet(val) }>
                    <Select.Option value="10">10$</Select.Option>
                    <Select.Option value="20">20$</Select.Option>
                    <Select.Option value="30">30$</Select.Option>
                </Select>
                </div>
                
                <div className="input-component" style={{border: "2px solid black"}}>
                <CanvasDraw ref={canvasRef} canvasWidth={200} canvasHeight={200} brushRadius={3} lazyradius={0}/>
                </div>
                
                <Spacer h={.5} />
            </div>
            <Button onClick={() => placeBet(canvasRef)} className="bet-button" shadow type="secondary" scale={2}>Success</Button>
        </div>
  );
}
