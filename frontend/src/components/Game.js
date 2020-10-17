import React, { useState } from 'react'
import Choices from './Choices.js'
import Display from './Display.js'

export default function Game(props){
    const [chosen, setChosen] = useState(null)
    const [score, setScore] = useState([])
    const round = score.length

    const choiceClick = e => {
        setChosen(e.target.innerText)
    }
    
    function onReceive(e){
        const data = JSON.parse(e.data).message
        console.log(data)
        if(data.winner.name == props.userId){
            var result = 'win'
        } else {
            var result = 'loss'
        }
        var newScore = [...score,result]
        setScore(newScore)
    }
    props.webSocket.onmessage = e => onReceive(e)

    function displayButtonOrResult(score){
        if(score.filter(x => x=='loss').length == 3){
            return ['you have lost', props.findOpponentButton]
        } 
        if(score.filter(x => x=='win').length == 3){
            return ['you have won', props.findOpponentButton]
        } 
        return <button onClick={()=>sendMove(chosen)}>Select</button>
    }

    function sendMove(move){
        //in game.py pass pass doesnt result in a round and moves stay put in db
        //not a big problem, should be adjusted
        if(move){
            props.webSocket.send(JSON.stringify({move:move[0]}))
            setChosen(null)
        }    
    }
    return (
        <>
            <Display 
                score={score}
                userId={props.userId}
                opponentName={props.opponentName}/>
            <Choices
                chosen={chosen}
                choiceClick={choiceClick}/>
            {displayButtonOrResult(score)}
        </>
    )
}

