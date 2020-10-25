import React, { useState, useEffect } from 'react'
import Choices from './Choices.js'
import Display from './Display.js'

export default function Game(props){
    const [chosen, setChosen] = useState(null)
    const [score, setScore] = useState([])
    const [gameScale, setGameScale] = useState('1')
    const [movesFromLastRound, setMovesFromLastRound] = useState(null)

    useEffect(() => {    
        var handleResize = () => {
            let newState = getGameScale()
            setGameScale(newState)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[])

    const gameStyle = {
        transition:'0.2s',
        position:'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%) scale('+gameScale+')'
    }

    const choiceClick = e => {
        setChosen(e.target.id)
    }
    
    props.webSocket.onmessage = e => {
        const data = JSON.parse(e.data).message
        console.log(data)
        if(data.winner.name == props.userId){
            var result = 'win'
        } else {
            var result = 'loss'
        }
        var newScore = [...score,result]
        setScore(newScore)
        setChosen(null)
        setMovesFromLastRound({
            [data.winner.name]:data.winner.move,
            [data.loser.name]:data.loser.move
        })
    }

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
        }    
    }

    return (
        <div style={gameStyle}>
            <Display 
                score={score}
                userId={props.userId}
                opponentName={props.opponentName}
                movesFromLastRound={movesFromLastRound}/>
            <Choices
                chosen={chosen}
                choiceClick={choiceClick}/>
            {displayButtonOrResult(score)}
        </div>
    )
}

function getGameScale(){
    var scaleWidth = 1.5
    var scaleHeight = 1.5
    if(screen.width>window.outerWidth){
        scaleWidth = (window.outerWidth/screen.width)*1.5
    }
    if(screen.height>window.outerHeight){
        scaleHeight = (window.outerHeight/screen.height)*1.5
    }
    var gameScale = Math.min(scaleWidth,scaleHeight)
    return String(gameScale)
}

