import React, { useState, useEffect } from 'react'
import Choices from '../Choices'
import Display from '../Display'
import PlayAgainModal from '../PlayAgainModal'

export default function Game({webSocket, updateUserStats, userId, opponentName}){
    const [chosen, setChosen] = useState(null)
    const [score, setScore] = useState([])
    const [gameScale, setGameScale] = useState('1')
    const [movesFromLastRound, setMovesFromLastRound] = useState(null)
    const [endOfGameDetails, setEndOfGameDetails] = useState(null)
    const [time, setTime] = useState(null)

    useEffect(() => {    
        const date = new Date
        setTime(date.getTime())
        var message = webSocket.gameScore
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
    
    webSocket.onmessage = e => {
        var message = JSON.parse(e.data)
        switch(message.type){
            case('connect'):
                setScoreOnConnect(message,setScore)
                console.log(message)
                break
            case('disconnect'):
                console.log(message.message)
                break
            case('refresh.timer'):
                var update = message.message
                console.log('REFRESHING')
                setTime(Math.round(update.time)*1000)
                break
            case('game.update'):
                update = message.message
                setTime(Math.round(update.time)*1000)
                var result = getRoundResult(update,userId,opponentName,setMovesFromLastRound)
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
            return updateUserStats(ratingChange*-1,'loss')
        } 
        if(result == 'win'){
            return updateUserStats(ratingChange,'win')
        } 
    }
    
    function sendMove(move){
        if(move){
            webSocket.send(JSON.stringify({move:move[0]}))
        }    
    }

    var endOfGameModal = showEndOfGame(endOfGameDetails,webSocket)

    return (
        <div style={gameStyle}>
            <Display 
                time={time}
                score={score}
                userId={userId}
                opponentName={opponentName}
                movesFromLastRound={movesFromLastRound}/>
            <Choices
                chosen={chosen}
                choiceClick={choiceClick}/>
            <button onClick={()=>sendMove(chosen)}>Select</button>
            {endOfGameModal}
        </div>
    )
}

function showEndOfGame(endOfGameDetails,webSocket){
    if(endOfGameDetails){
        if(endOfGameDetails.result == 'win'){
            return <PlayAgainModal 
                gameResult='won' 
                newScore={endOfGameDetails.rating}
                webSocket={webSocket}/>
        } else {
            return <PlayAgainModal 
                gameResult='lost' 
                newScore={endOfGameDetails.rating}
                webSocket={webSocket}/>
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

function getRoundResult(update, userId, opponentName, setMovesFromLastRound){
    if(update.draw){
        setMovesFromLastRound({
            [userId]:update.move,
            [opponentName]:update.move
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
        return didUserWin(update.winner.name,userId)
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

