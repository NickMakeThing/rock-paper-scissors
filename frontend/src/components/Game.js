import React, { useState, useEffect } from 'react'
import Choices from './Choices'
import Display from './Display'
import PlayAgainModal from './PlayAgainModal'

export default function Game(props){
    const [chosen, setChosen] = useState(null)
    const [score, setScore] = useState([])
    const [gameScale, setGameScale] = useState('1')
    const [movesFromLastRound, setMovesFromLastRound] = useState(null)
    const [endOfGameDetails, setEndOfGameDetails] = useState(null)

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
        const update = JSON.parse(e.data).message
        if(update.draw){
            var result = 'draw'
            setMovesFromLastRound({
                [props.userId]:update.move,
                [props.opponentName]:update.move
            })
        } else {
            if(update.winner.name == props.userId){
                var result = 'win'
            } else {
                var result = 'loss'
            }
            setMovesFromLastRound({
                [update.winner.name]:update.winner.move,
                [update.loser.name]:update.loser.move
            })
        }

        updateScore(score, setScore, result)
        setChosen(null)
        if(update.game_finished){
            var ratingChange = update.game_finished
            var newRating = endGame(result, ratingChange)
            setEndOfGameDetails({rating:newRating, result:result})
        }
    }

    function endGame(result,ratingChange){
        if(result=='loss'){
            return props.updateUserStats(ratingChange*-1)
        } 
        if(result == 'win'){
            return props.updateUserStats(ratingChange)
        } 
    }
    
    function sendMove(move){
        //in game.py pass pass doesnt result in a round and moves stay put in db
        //not a big problem, should be adjusted
        if(move){
            props.webSocket.send(JSON.stringify({move:move[0]}))
        }    
    }

    var endOfGameModal = showEndOfGame(endOfGameDetails,props)

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
            <button onClick={()=>sendMove(chosen)}>Select</button>
            {endOfGameModal}
        </div>
    )
}

function showEndOfGame(endOfGameDetails,props){
    if(endOfGameDetails){
        if(endOfGameDetails.result == 'win'){
            return <PlayAgainModal 
                gameResult='won' 
                newScore={endOfGameDetails.rating}
                webSocket={props.webSocket}/>
        } else {
            return <PlayAgainModal 
                gameResult='lost' 
                newScore={endOfGameDetails.rating}
                webSocket={props.webSocket}/>
        }
    }
    return null
}

function updateScore(score,setScore,result){
    var scoreCopy = [...score]
    if(scoreCopy.slice(-1) == 'draw'){
        if(result!='draw'){
            scoreCopy.pop()
            scoreCopy.push(result)
            setScore(scoreCopy)
        }
    } else {
        scoreCopy.push(result)
        setScore(scoreCopy)
    }
}

function getGameScale(){//change
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

