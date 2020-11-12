import React, { useState, useEffect } from 'react'

export default function LeaderBoard({setLeaderBoard,leaderBoard}){

    const [playerData, setPlayerData] = useState({})
    useEffect(() => {    
        if(leaderBoard){
            getPlayerData(setPlayerData)
        }
    },[leaderBoard])

    return (
        <>
            <span 
                style={{cursor: 'pointer'}}
                onClick={e=>toggleLeaderBoard(e,setLeaderBoard,leaderBoard)}>
                Leaderboard
            </span>
            {showLeaderBoardModal(setPlayerData,playerData,leaderBoard)}
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
        })
        .catch(err=>console.log(err))
}

function toggleLeaderBoard(e,setLeaderBoard,leaderBoard){
    e.stopPropagation()
    setLeaderBoard(!leaderBoard)
}

function showLeaderBoardModal(setPlayerData,playerData,leaderBoard){ // could be its own component
    var grid = {
        display: 'grid',
        gridTemplateColumns:'25% 25% 25% 25%'
    }
    if(leaderBoard && playerData.results){
        var arr=[
            <div style={Object.assign({color:'#878886'},grid)}>
                <span>name</span>
                <span>score</span>
                <span>wins</span>
                <span>losses</span>
            </div>
        ]
            for(let i of playerData.results){
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
        var modalNav = getModalNavigationButtons(setPlayerData,playerData)
        return <div 
            style={modalStyle}
            onClick={e=>e.stopPropagation()}>
                <h3 style={{textAlign:'center'}}>Leaderboard</h3>
                {arr}
                <div style={modalNavStyle}>
                    {modalNav.previousButton}
                    <div style={navNumbersContainerStyle}>
                        {modalNav.pageNumbers}
                    </div>
                    {modalNav.nextButton}
                </div>
        </div>
    }
}

function getModalNavigationButtons(setPlayerData,playerData){
    var previousPage = playerData.previous
    var nextPage = playerData.next
    var currentPage = parseInt(playerData.currentPage)
    var pageNumbers = []
    var lastPage= Math.ceil(playerData.count/20)
    for(let i=currentPage-2;i<currentPage+3;i++){
        if(i>0 && i<lastPage+1){
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
                        onClick={()=>getPlayerData(setPlayerData,'http://localhost:8000/ranks/?page='+i)}>{i}</span>
                )
            }
        }
    }
    if(nextPage){
        var nextButton = <button onClick={()=>getPlayerData(setPlayerData,nextPage)}>next</button>
    } else {
        var nextButton = <button disabled>next</button> 
    }
    if(previousPage){
        if(currentPage==2){
            var previousButton = <button onClick={()=>getPlayerData(setPlayerData)}>previous</button>
        } else {
            var previousButton = <button onClick={()=>getPlayerData(setPlayerData,previousPage)}>previous</button>
        }
    } else {
        var previousButton = <button disabled>previous</button> 
    }
    return {previousButton, nextButton, pageNumbers}
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
