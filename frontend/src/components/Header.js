import React, { useState, useEffect } from 'react'
import LeaderBoard from './LeaderBoard'
import Cookie from 'js-cookie'

export default function Header(props){
    return (
        <header style={{padding:'10px'}}>
            <h2 style={{margin:0}}>
                <div style={leftSideStyle}>
                    <div style={{display:'inline-block', marginRight: '10px'}}>
                        <span>
                            {props.userId}
                        </span> 
                    </div>
                    score:{100} 
                </div>
                <div style={rightSideStyle}>
                    <LeaderBoard
                        leaderBoard={props.leaderBoard}
                        setLeaderBoard={props.setLeaderBoard}/>
                </div>
            </h2>
        </header>
    )
}

const leftSideStyle = {
    display:'inline-block',
    width:'50%',
    textAlign:'left'
}
const rightSideStyle = {
    display:'inline-block',
    width:'50%',
    textAlign:'right'
}