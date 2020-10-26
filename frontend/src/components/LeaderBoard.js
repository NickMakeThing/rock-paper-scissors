import React, { useState, useEffect } from 'react'

export default function LeaderBoard(props){
    const [playerData, setPlayerData] = useState([])
    
    useEffect(() => {    
        if(props.leaderBoard){
            getPlayerData(setPlayerData)
        }
    },[props.leaderBoard])

    const state = {
        playerData: playerData, 
        leaderBoard: props.leaderBoard
    }
    return (
        <>
            <span 
                style={{cursor: 'pointer'}}
                onClick={e=>toggleLeaderBoard(e,props)}>
                Leaderboard
            </span>
            {showLeaderBoardModal(state)}
        </>
    )
}

function getPlayerData(setState){
    fetch('http://localhost:8000/ranks/')
        .then(response => response.json())
        .then(data => setState(data))//????
}

function toggleLeaderBoard(e,props){
    e.stopPropagation()
    props.setLeaderBoard(!props.leaderBoard)
}

function showLeaderBoardModal(state){
    var grid = {
        display: 'grid',
        gridTemplateColumns:'25% 25% 25% 25%'
    }
    if(state.leaderBoard){
        var arr=[
            <div style={Object.assign({color:'#878886'},grid)}>
                <span>name</span>
                <span>score</span>
                <span>wins</span>
                <span>losses</span>
            </div>
        ]
        for(let i of state.playerData){
            arr.push(<div style={grid}>
                <span>
                    <span>{i.name}</span>
                </span>
                <span>
                    <span style={{color:'#007FFF'}}>{i.score}</span>
                </span>
                <span>
                    <span style={{color:'#007FFF'}}>{i.wins}</span>
                </span>
                <span>
                    <span style={{color:'#007FFF'}}>{i.losses}</span>
                </span>
            </div>)
        }
        return <div 
            style={modalStyle}
            onClick={e=>e.stopPropagation()}>
                <h3 style={{textAlign:'center'}}>Leaderboard</h3>
                {arr}
        </div>
    }
}

const modalStyle = {
    fontSize:'75%',
    textAlign:'left',
    position:'absolute',
    height:'600px',
    lineHeight:'normal',
    width:'450px',
    padding:'10px',
    backgroundColor: 'white',
    boxShadow: '0 0 0 1000px rgba(0,0,0,0.3)',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-65%)',
    zIndex:'1'
}

