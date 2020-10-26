import React from 'react'
export default function PlayAgainModal(props){

    return(
        <div style={playAgainStyle}>
            You have {props.gameResult}<br/>
            Your score is now {props.newScore}<br/>
            <button style={buttonStyle} 
                onClick={()=>{props.webSocket.close()}}>
                return
            </button>
        </div>
    )
}

const playAgainStyle = {
    position: 'absolute',
    top:'50%',
    left:'50%',
    transform: 'translateX(-50%) translateY(-50%)',
    border:'solid 2px #bbc0c4',
    borderRadius:10,
    padding:5,
    backgroundColor:'white'
}

const buttonStyle = {
    fontSize:'75%',
    width:150,
    height:50
}