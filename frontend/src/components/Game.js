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
        var message = JSON.parse(e.data)
        console.log('message::::::::',message)
        if(message.game_state){
            console.log('workingggggggg')
            var gameState = getGameState(message.game_state) // rename loadGameState() and put setScore inside?
            setScore(gameState)
        } else {
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

function getGameState(game_state){
    var wins = new Array(game_state.player_score).fill('win')
    var losses = new Array(game_state.opponent_score).fill('loss')
    console.log(wins,losses)
    return wins.concat(losses)
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

function synchronizeGame(gameState, score, setScore){
    if(isEmpty(score)){
        setScore(gameState) //out of order. can maintain the order by also keeping state in local storage as a backup
    } /*else {
        if (countElement(gameState, 'wins') > countElement(score, 'wins')){
            setScore([...score, 'win'])
        }
        if (countElement(gameState, 'losses') > countElement(score, 'losses')){
            setScore([...score, 'loss'])
        }
    }*/
}

function isEmpty(array){
    if(array.length == 0){
        return true
    }
    return false
}

function countElement(array, element){
    return array.filter(x => x==element).length
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

