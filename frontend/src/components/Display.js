import React from 'react'

export default function Display(props){
    return (
        <>    
            <span style={roundNumberStyle}>round 5/5</span>
            <div style={{whiteSpace: 'nowrap', margin:'50px', marginTop:'0px'}}>
            <div style={userBoxStyle}>{props.userId}</div>
            <div style={middleBoxContainerStyle}>
                {displayScore(props.score)}
            </div>
             <div style={opponentBoxStyle}>{props.opponentName}</div>
            </div>
        </>
    )
}

function displayScore(score){
    score = score.map(result =>{
            return <div style={middleBoxStyle}>{result}</div>
    })
    score[0] = [score[0],<br/>]
    return score
}

const userBoxStyle = {
    display: 'inline-block',
    width:'300px',
    height:'300px',
    backgroundColor:'#3AAFB9',
    marginRight:'50px',
}

const opponentBoxStyle = {
    display: 'inline-block',
    width:'300px',
    height:'300px',
    backgroundColor:'#3AAFB9',
    marginLeft:'50px'
}

const middleBoxStyle = {
    float:'left',
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
