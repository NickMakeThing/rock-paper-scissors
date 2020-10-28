import React, { useState, useEffect } from 'react'
import LeaderBoard from './LeaderBoard'
export default function Header(props){
    const score = props.userData.score
    const wins = props.userData.wins
    const losses = props.userData.losses
    function toggleDropDown(e){
        e.stopPropagation()
        props.setDropDown(!props.dropDown)
    }
    const dropDownStyle = showOrHideDropDown(props.dropDown)

    return (
        <header style={rootStyle}>
                <h2 style={leftSideStyle}>
                    <div style={userIdContainer} 
                        onClick={toggleDropDown}>
                        <span style={profileIconStyle}/>
                        <span style={{marginLeft:10}}> {/* needs work */}
                            {props.userId}
                        </span> 
                    </div>
                    <div style={dropDownStyle}
                        onClick={e=>e.stopPropagation()}>
                        score:{score}<br/>
                        wins:{wins}<br/>
                        losses:{losses}
                    </div>
                </h2>
                <h2 style={rightSideStyle}>
                    <LeaderBoard
                        leaderBoard={props.leaderBoard}
                        setLeaderBoard={props.setLeaderBoard}/>
                </h2>
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
const rootStyle = {
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    height:70
}
const leftSideStyle = {   
    display:'inline-block',
    marginLeft:25
}
const rightSideStyle = {    
    display:'inline-block',
    marginRight:25
}
const profileIconStyle = {
    display:'inline-block',
    height:'50px',
    width:'50px',
    borderRadius:'50px',
    backgroundColor:'white'
}
const userIdContainer = {
    display:'flex',
    cursor:'pointer',
    alignItems:'center',
    
}
//define function and style here, in function add/modify style eg dropDownStyle['display'] = 'block'
//then call function and put style as arg in component. this gives 'strict mode does not allow' error
//using object assign only returns one of them even though conditionals work fine.