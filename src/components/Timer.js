
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import React from 'react'
import axios from "axios";

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <p className="timer">Contract Executed</p>;
    }
  
    return (
          <div className="timer">
            <p style={{textAlign: "center"}}>Remaining: <br></br>{Math.floor(remainingTime / 60) < 10? "0":""}{Math.floor(remainingTime / 60)}:{(remainingTime % 60 < 10) && (remainingTime % 60 > 0)? "0": ""}{remainingTime % 60}{remainingTime % 60 == 0? "0":"" }</p>
          </div>
    );
  };

const triggerTransaction = () => {
    axios.post('/user', {
        firstName: 'Fred',
        lastName: 'Flintstone'
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });    
}
  

export function Timer() {

    return (
        <CountdownCircleTimer
        isPlaying
        duration={700}
        colors={['#000000']}
        onComplete={triggerTransaction}
      >
        {renderTime}
      </CountdownCircleTimer>
    )
}