import { useState, createRef } from "react"
import { Button, Spacer, Select } from '@geist-ui/react'
import CanvasDraw from "react-canvas-draw";
import { pedersen } from "../pedersen";


function placeBet(canvasRef, horseNum, bet) {
    let hash = require('object-hash')
    let imageHash = hash(canvasRef.current.getSaveData())
    let secret = parseInt(imageHash.substr(0, 10), 16);
    console.log("secret: ", secret)
    canvasRef.current.clear()
    let pedersenHash = pedersen([secret, 0])
    console.log("pedersen: ", pedersenHash);
    console.log("horsenum: ", horseNum, " bet ", bet);
}

export function Interface(props) {
    const [horseNum, setHorseNum] = useState('1');
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

            <div className="interface-controls"><div className="button-wrapper"><Button onClick={() => placeBet(canvasRef, horseNum, bet)} className="bet-button" shadow type="secondary" scale={2}>Success</Button></div></div>
        </div>
  );
}
