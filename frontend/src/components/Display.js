import React from 'react'
import rock from './images/rock.jpg'
import paper from './images/paper.jpg'
import scissors from './images/scissors.png'
import questionmark from './images/questionmark.png'

export default function Display(props){
    if(props.movesFromLastRound){
        var userMoveImage = imageOfLastMove(
            props.movesFromLastRound[props.userId]
        )
        var opponentMoveImage = imageOfLastMove(
            props.movesFromLastRound[props.opponentName]
        )
    } else {
        var userMoveImage = questionmark
        var opponentMoveImage = questionmark
    }

    return (
        <>    
            <span style={roundNumberStyle}>round 5/5</span>
            <div style={displayContainerStyle}>
                <img src={userMoveImage} 
                    style={userBoxStyle} />
                <div style={middleBoxContainerStyle}>
                    {displayScore(props.score)}
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

const userBoxStyle = {
    display: 'inline-block',
    width:'300px',
    height:'300px',
    marginRight:'50px',
}

const opponentBoxStyle = {
    display: 'inline-block',
    width:'300px',
    height:'300px',
    marginLeft:'50px'
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

const roundNumberStyle = {
    display:'inline-block',
    textAlign: 'center',
    marginTop:'50px'
}
