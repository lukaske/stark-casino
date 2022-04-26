import { useState, createRef, useEffect } from "react"
import { Button, Spacer, Select } from '@geist-ui/react'
import CanvasDraw from "react-canvas-draw";
import { pedersen } from "../pedersen";


import { useStarknet, useStarknetInvoke } from '@starknet-react/core'
import { useBetContract } from '~/hooks/bet'

export function IncrementCounter() {
  const { account } = useStarknet()
  const { contract: counter } = useCounterContract()
  const { invoke } = useStarknetInvoke({ contract: counter, method: 'incrementCounter' })

  if (!account) {
    return null
  }

  return (
    <div>
      <button onClick={() => invoke({ args: ['0x1'] })}>Increment Counter by 1</button>
    </div>
  )
}

function placeBet(canvasRef, ballNum, bet, account, bet_contract) {
    let hash = require('object-hash')
    let imageHash = hash(canvasRef.current.getSaveData())
    let secret = parseInt(imageHash.substr(0, 10), 16);
    console.log("secret: ", secret)
    canvasRef.current.clear()
    let pedersenHash = pedersen([secret, 0])
    console.log("pedersen: ", pedersenHash);
    console.log("horsenum: ", ballNum, " bet ", bet);


    let race_index = 0;

    {/*const { data: counterResult } = useStarknetCall({
      contract: bet,
      method: 'place_bet',
      args: [race_index, ballNum, pedersenHash],
    })*/}

    // get timestap


}

export function Interface(props) {
    const [horseNum, setHorseNum] = useState('1');
    const [bet, setBet] = useState("10");

    const [animal, setAnimal] = useState("");
    const canvasRef = createRef();

    // Use contract
    const { account } = useStarknet()
    const { bet_contract } = useBetContract()

    
    useEffect(() => {
        let animals = ["box", "cross", "circle", "star", "triangle"];
        setAnimal(animals[Math.floor(Math.random()*animals.length)]);
    }, [])
    

    return (
        <div className="wrapper">
            <div className="ui-wrapper">
                <div className="input-component">
                <Select placeholder="Choose your ball!" onChange={(val) => setHorseNum(val) }>
                    <Select.Option value="0">Blue</Select.Option>
                    <Select.Option value="1">White</Select.Option>
                    <Select.Option value="2">Red</Select.Option>
                    <Select.Option value="3">Yelllow</Select.Option>
                    <Select.Option value="4">Green</Select.Option>
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
                <span>Draw a <b>{animal}</b></span>
                <div style={{ borderRadius: "5px" }}>
                <CanvasDraw ref={canvasRef} canvasWidth={200} canvasHeight={200} brushRadius={3} lazyradius={0}/>
                </div>
                </div>
                
                <Spacer h={.5} />
            </div>

            <div className="interface-controls"><div className="button-wrapper"><Button onClick={
                () => placeBet(canvasRef, horseNum, bet, account, bet_contract)
                } className="bet-button" shadow type="error-light" scale={2}>Bet now!</Button></div></div>
        </div>
  );
}
