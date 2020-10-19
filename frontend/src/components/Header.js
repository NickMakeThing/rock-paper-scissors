import React, { useState, useEffect } from 'react'
import LeaderBoard from './LeaderBoard'
import Cookie from 'js-cookie'

export default function Header(props){
    const score = props.userData.score
    const wins = props.userData.wins
    const losses = props.userData.losses
    return (
        <header style={rootStyle}>
                <h2 style={leftSideStyle}>
                    <div style={{display:'inline-block', marginRight: '10px'}}>
                        <span>
                            {props.userId}
                        </span> 
                    </div>
                    {/* open in dropdown behind name or something */}
                    score:{score} wins:{wins} losses:{losses} 
                </h2>
                <h2 style={rightSideStyle}>
                    <LeaderBoard
                        leaderBoard={props.leaderBoard}
                        setLeaderBoard={props.setLeaderBoard}/>
                </h2>
        </header>
    )
}
const rootStyle = {
    display:'grid',
    gridTemplateColumns: '50% 50%',
}
const leftSideStyle = {
    display:'inline-block',
    textAlign:'left',
    paddingLeft: '50px'
}
const rightSideStyle = {
    display:'inline-block',
    textAlign:'right',
    paddingRight: '50px'
}