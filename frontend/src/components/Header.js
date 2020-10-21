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
                    <div style={{cursor:'pointer'}} 
                        onClick={toggleDropDown}>
                        <span style={profileIconStyle}/>
                        <span style={{position:'relative', marginLeft:0, top:-13 }}> {/* needs work */}
                            {props.userId}
                        </span> 
                    </div>
                    <div style={dropDownStyle}>
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
    display:'grid',
    gridTemplateColumns: '50% 50%',
    fontSize:'150%'
}
const leftSideStyle = {   
    display:'inline-block',
    height:'50px',
    marginTop:'10px',
    marginBottom:'10px',
    textAlign:'left',
    paddingLeft: '50px'
}
const rightSideStyle = {    
    display:'inline-block',
    height:'50px',
    marginTop:'10px',
    marginBottom:'10px',
    lineHeight:'50px',
    textAlign:'right',
    paddingRight: '50px'
}
const profileIconStyle = {
    display:'inline-block',
    height:'50px',
    width:'50px',
    borderRadius:'50px',
    backgroundColor:'white'
}
//define function and style here, in function add/modify style eg dropDownStyle['display'] = 'block'
//then call function and put style as arg in component. this gives 'strict mode does not allow' error
//using object assign only returns one of them even though conditionals work fine.