import React from 'react'

export default function LandingView(props){
    const userStats = props.userStats
    const findOpponentButton = props.findOpponentButton
    return(
    <div >
        <span style={headingStyle}>Rock Paper Scissors</span>
        <span style={infoStyle}>
            Play against other people in a game<br/>
            of rock paper scissors
        </span>
        <span style={buttonStyle}>
            {findOpponentButton}
        </span>
        {/* <div>
            <div style={lowerSectionStyle}>Your stats</div>
            <div>wins: {userStats.wins}</div>
            <div>losses: {userStats.losses}</div>
            <div>score: {userStats.score}</div>
        </div> */}
    </div>
    )
}



const headingStyle = {
    position:'absolute',
    fontSize:60,
    top:292,
    left:185
}

const infoStyle = {
    position:'absolute',
    fontSize:40,
    top:381,
    left:185,
    textAlign:'left'
}

const buttonStyle = {
    position:'absolute',
    top:535,
    left:185
}

const lowerSectionStyle = {
    paddingBottom:10,
    fontWeight: 'bold'
}

