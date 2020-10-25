import React from 'react'

export default function LandingView(props){
    const userStats = props.userStats
    const findOpponentButton = props.findOpponentButton
    return(<>
        <div>
            <b>Play rock paper scissors against other people</b>
            {findOpponentButton}
        </div>
        <div style={horizontalLineStyle}/>
        <div>
            <b>your stats</b>
            <div>wins: {userStats.wins}</div>
            <div>losses: {userStats.losses}</div>
            <div>score: {userStats.score}</div>
        </div>
    </>)
}

const horizontalLineStyle = {
    width:'60vh',
    height:1,
    margin:20,
    backgroundColor:'black'
}