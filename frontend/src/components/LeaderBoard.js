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
        .then(data => {
            var currentPage = page.split('=').pop()
            data.currentPage = currentPage
            setState(data)
        })//????
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
    if(state.leaderBoard && state.playerData.results){
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
        var currentPage = parseInt(state.playerData.currentPage)
        var pageNumbers = []
        let page
        for(let i=currentPage-2;i<currentPage+3;i++){
            if(i>0 && i<12){//change 12 to var that is last page
                if(i==currentPage){
                    pageNumbers.push(
                        <span 
                            style={modalCurrentNumberStyle}>{i}</span>
                        )
                } else {
                    //page = 'http://localhost:8000/ranks/?page='+i this causes weird bug.
                    //must do the concat in in the arg space
                    //tested using onMouseOver={()=>{console.log(page)}} <- gives bad result
                    pageNumbers.push(
                        <span
                            style={modalNavNumberStyle}
                            onClick={()=>getPlayerData(state.setPlayerData,'http://localhost:8000/ranks/?page='+i)}>{i}</span>
                    )
                }
            }
        }
        if(nextPage){
            var nextButton = <button onClick={()=>getPlayerData(state.setPlayerData,nextPage)}>next</button>
        } else {
            var nextButton = <button disabled>next</button> 
        }
        if(previousPage){
            if(currentPage==2){
                var previousButton = <button onClick={()=>getPlayerData(state.setPlayerData)}>previous</button>
            } else {
                var previousButton = <button onClick={()=>getPlayerData(state.setPlayerData,previousPage)}>previous</button>
            }
        } else {
            var previousButton = <button disabled>previous</button> 
        }
        return <div 
            style={modalStyle}
            onClick={e=>e.stopPropagation()}>
                <h3 style={{textAlign:'center'}}>Leaderboard</h3>
                {arr}
                <div style={modalNavStyle}>
                    {previousButton}
                    <div style={navNumbersContainerStyle}>
                        {pageNumbers}
                    </div>
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

const navNumbersContainerStyle = {
    display:'inline-block',
    width:120,
    textAlign:'center'
}

const modalNavNumberStyle = {
    cursor: 'pointer',
    textAlign:'center',
    display:'inline-block',
    color:'blue',
    width:21,
    border:'solid 1px grey',
    borderRadius:2
}

const modalCurrentNumberStyle = {
    textAlign:'center',
    display:'inline-block',
    width:21,
    border:'solid 1px grey',
    borderRadius:2
}
