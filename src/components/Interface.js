import { useState, createRef, useEffect } from "react"
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

    const [animal, setAnimal] = useState("");
    const canvasRef = createRef();
    
    useEffect(() => {
        let animals = ["dog", "cat", "dinosaur", "ape", "rose"];
        setAnimal(animals[Math.floor(Math.random()*animals.length)]);
    }, [])
    

    return (
        <div classNacreateRefme="wrapper">
            <div className="ui-wrapper">
                <div className="input-component">
                <Select placeholder="Choose your horse!" onChange={(val) => setHorseNum(val) }>
                    <Select.Option value="1">Ball 1</Select.Option>
                    <Select.Option value="2">Ball 2</Select.Option>
                    <Select.Option value="3">Ball 3</Select.Option>
                    <Select.Option value="4">Ball 4</Select.Option>
                    <Select.Option value="5">Ball 5</Select.Option>
                </Select>
                </div>

                <div className="input-component">
                <Select className="select" placeholder="Choose your bet!" onChange={(val) => setBet(val) }>
                    <Select.Option value="0.01">0.01 ETH</Select.Option>
                    <Select.Option value="0.02">0.02 ETH</Select.Option>
                    <Select.Option value="0.03">0.03 ETH</Select.Option>
                </Select>
                </div>
                
                <div className="input-component">
                <span>Draw a picture of a <b>{animal}</b></span>
                <div style={{border: "2px solid black"}}>
                <CanvasDraw ref={canvasRef} canvasWidth={200} canvasHeight={200} brushRadius={3} lazyradius={0}/>
                </div>
                </div>
                
                <Spacer h={.5} />
            </div>

            <div className="interface-controls"><div className="button-wrapper"><Button onClick={() => placeBet(canvasRef, horseNum, bet)} className="bet-button" shadow type="secondary" scale={2}>Success</Button></div></div>
        </div>
  );
}
