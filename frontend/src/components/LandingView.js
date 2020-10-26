import React from 'react'

export default function LandingView(props){
    const userStats = props.userStats
    const findOpponentButton = props.findOpponentButton
    return(
    <div >
        <div>
            <b>Play rock paper scissors<br/> 
            against other people</b>
            {findOpponentButton}
        </div>
        <div style={horizontalLineStyle}/>
        <div>
            <div style={lowerSectionStyle}>Your stats</div>
            <div>wins: {userStats.wins}</div>
            <div>losses: {userStats.losses}</div>
            <div>score: {userStats.score}</div>
        </div>
    </div>
    )
}

const horizontalLineStyle = {
    width:'40vw',
    height:1,
    marginTop:45,
    marginBottom:45,
    backgroundColor:'black'
}

const lowerSectionStyle = {
    paddingBottom:10,
    fontWeight: 'bold'
}

