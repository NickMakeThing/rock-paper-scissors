import React from 'react'
import rock from './images/rock.jpg'
import paper from './images/paper.jpg'
import scissors from './images/scissors.png'
import questionmark from './images/questionmark.png'
import PieTimer from './PieTimer'

export default function Display({userId, time, opponentName, score, movesFromLastRound}){
    if(movesFromLastRound){
        var userMoveImage = imageOfLastMove(
            movesFromLastRound[userId]
        )
        var opponentMoveImage = imageOfLastMove(
            movesFromLastRound[opponentName]
        )
    } else {
        var userMoveImage = questionmark
        var opponentMoveImage = questionmark
    }

    return (
        <>    {/*if game finished, stop showing timer? */}
            <span style={timerStyle}><PieTimer time={time}/></span>
            <div style={displayContainerStyle}>
                <img src={userMoveImage} 
                    style={userBoxStyle} />
                <div style={middleBoxContainerStyle}>
                    {displayScore(score)}
                </div>
                <img src={opponentMoveImage} 
                    style={opponentBoxStyle} />
            </div>
        </>
    )
}

function imageOfLastMove(move){
    switch(move){
        case 'r':
            return rock
        case 'p':
            return paper
        case 's':
            return scissors
    }
}

function displayScore(score){
    var count = 0
    score = score.map((result) =>{
            count++
            return <div key={'round'+count}style={middleBoxStyle}>{result}</div>
            
    })
    score[0] = [score[0],<br key={'linebreak'}/>]
    return score
}

const displayContainerStyle = {
    display:'flex'
}

var size = 1
if (screen.height<=900){
    size = 0.5
}

const userBoxStyle = {
    display: 'inline-block',
    width:300*size,
    height:300*size,
    marginRight:50*size
}

const opponentBoxStyle = {
    display: 'inline-block',
    width:300*size,
    height:300*size,
    marginLeft:50*size
}

const middleBoxStyle = {
    float:'left',
    display:'inline',
    lineHeight:'55px',
    width:'56px',
    height: '56px',
    marginBottom:'5px'
}

const middleBoxContainerStyle = {
    display: 'inline-block', 
    width: '57px', 
}

const timerStyle = {
    display:'inline-block',
    textAlign: 'center',
    marginTop:'50px'
}
