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
        var message = props.webSocket.gameScore
        setScoreOnConnect(message,setScore)

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
        var message = JSON.parse(e.data)
        if(message.type == 'connect'){
            setScoreOnConnect(message,setScore)
        } else if(message.type == 'disconnect'){
            console.log(message.message)
        } else if(message.type == 'game.update'){
            const update = message.message
            var result = getRoundResult(update,props,setMovesFromLastRound)
            updateScore(score, setScore, result)
            setChosen(null)
            if(update.game_finished){
                var newRating =  endGame(result, update.game_finished)
                setEndOfGameDetails({rating:newRating, result:result})
            }
        }
    }

    function endGame(result,ratingChange){
        if(result=='loss'){
            return props.updateUserStats(ratingChange*-1,'loss')
        } 
        if(result == 'win'){
            return props.updateUserStats(ratingChange,'win')
        } 
    }
    
    function sendMove(move){
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

function setScoreOnConnect(message,setScore){
    var game_state = message.message
    if(game_state){
        var wins = new Array(game_state.player_score).fill('win')
        var losses = new Array(game_state.opponent_score).fill('loss')
        setScore(wins.concat(losses))
    }
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

function getRoundResult(update,props,setMovesFromLastRound){
    if(update.draw){
        setMovesFromLastRound({
            [props.userId]:update.move,
            [props.opponentName]:update.move
        })
        return 'draw'
    } else {
        var winnerMove = update.winner.move
        var loserMove = update.loser.move
        if(winnerMove && loserMove){
            setMovesFromLastRound({
                [update.winner.name]:winnerMove,
                [update.loser.name]:loserMove
            })
        } else {
            console.log('place holder. else statement may be unnecassery')
        }
        return didUserWin(update.winner.name, props.userId)
    }
}

function didUserWin(winner,userId){
    if(winner == userId){
        return 'win'
    } else {
        return 'loss'
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

