import React, { useState, useEffect } from 'react'

export default function LeaderBoard(props){
    const [playerData, setPlayerData] = useState({})
    useEffect(() => {    
        if(props.leaderBoard){
            getPlayerData(setPlayerData)
        }
    },[props.leaderBoard])

    const state = {
        setPlayerData: setPlayerData,
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

function getPlayerData(setState,page='http://localhost:8000/ranks/?page=1'){
    fetch(page)
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
    if(state.playerData.results){
        var arr=[
            <div style={Object.assign({color:'#878886'},grid)}>
                <span>name</span>
                <span>score</span>
                <span>wins</span>
                <span>losses</span>
            </div>
        ]

            for(let i of state.playerData.results){
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
        var previousPage = state.playerData.previous
        var nextPage = state.playerData.next
        if(nextPage){
            var nextButton = <button onClick={()=>getPlayerData(state.setPlayerData,nextPage)}>next</button>
        }
        if(previousPage){
            var previousButton = <button onClick={()=>getPlayerData(state.setPlayerData,previousPage)}>previous</button>
        }
        return <div 
            style={modalStyle}
            onClick={e=>e.stopPropagation()}>
                <h3 style={{textAlign:'center'}}>Leaderboard</h3>
                {arr}
                <div style={modalNavStyle}>
                    {previousButton}
                    numbers...
                    current page
                    ...numbers
                    {nextButton}
                </div>
        </div>
    }
}

const modalStyle = {
    display:'flex',
    flexDirection:'column',
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

const modalNavStyle = {
    alignSelf:'center',
    marginTop:'auto'
}
