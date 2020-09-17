import React from 'react'

export default function FindOpponentButton(props){
    return (
        <button
            style={buttonStyle} 
            onClick={props.onClick}>
            Find Opponent
        </button>
    )
}

const buttonStyle={
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-75%)'
}