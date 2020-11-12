import React, { useState, useEffect } from 'react'
import LeaderBoard from './LeaderBoard'
export default function Header({
    userData: {score, wins, losses},
    dropDown,
    userId,
    leaderBoard,
    setLeaderBoard,
    setDropDown
}){
    
    function toggleDropDown(e){
        e.stopPropagation()
        setDropDown(!dropDown)
    }
    const dropDownStyle = showOrHideDropDown(dropDown)

    return (
        <header style={{fontSize:33}}>
                <span style={userIdContainer}>
                    <div  
                        onClick={toggleDropDown}>
                        <span style={{marginLeft:10}}> 
                            {userId}
                        </span> 
                    </div>
                    <div style={dropDownStyle}
                        onClick={e=>e.stopPropagation()}>
                        score:{score}<br/>
                        wins:{wins}<br/>
                        losses:{losses}
                    </div>
                </span>
                <span style={rightSideStyle}>
                    <LeaderBoard
                        leaderBoard={leaderBoard}
                        setLeaderBoard={setLeaderBoard}/>
                </span>
        </header>
    )
}

function showOrHideDropDown(dropDown){
    var dropDownStyle = {
        position:'absolute',
        backgroundColor:'white',
        padding:'5px',
        borderRadius:'10px'
    }
    if(dropDown){
        dropDownStyle['display'] = 'block'
        return dropDownStyle
    } else {
        dropDownStyle['display'] = 'none'
        return dropDownStyle
    }
}
const rightSideStyle = {    
    position:'absolute',
    top:25,
    right:185
}
const userIdContainer = {
    position:'absolute',
    cursor:'pointer',
    top:25,
    left:185
}
