import React from 'react'
import LeaderBoard from './LeaderBoard'

export default function Header(props){
    return (
        <header style={{padding:'10px'}}>
            <h2 style={{margin:0}}>
                <div style={leftSideStyle}>
                    {username} score:{rating} 
                </div>
                <div style={rightSideStyle}>
                    <LeaderBoard
                        leaderBoard={props.leaderBoard}
                        setLeaderBoard={props.setLeaderBoard}/>
                    <a href='#'>logout</a>
                </div>
            </h2>
        </header>
    )
}

const username = 'username'
const rating = 1234
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