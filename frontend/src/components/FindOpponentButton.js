import React from 'react'

export default function FindOpponentButton(props){
    return (
        <div 
            style={buttonStyle} >
            <span 
                style={{color:'red'}}>
                {props.error}
            </span><br/>
            <button 
                onClick={props.onClick}>
                Find Opponent
            </button>
        </div>
    )
}

const buttonStyle={
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-75%)'
}