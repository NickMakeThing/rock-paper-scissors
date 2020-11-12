import React from 'react'
export default function PlayAgainModal({gameResult,newScore,webSocket}){

    return(
        <div style={playAgainStyle}>
            You have {gameResult}<br/>
            {/* Your score is now {newScore}<br/> */}
            <button style={buttonStyle} 
                onClick={()=>{webSocket.close()}}>
                return
            </button>
        </div>
    )
}

const playAgainStyle = {
    position: 'absolute',
    top:'35%',
    left:'50%',
    transform: 'translateX(-50%) translateY(-50%)',
    border:'solid 2px #bbc0c4',
    borderRadius:10,
    padding:20,
    backgroundColor:'white'
}

const buttonStyle = {
    fontSize:'75%',
    width:150,
    height:50,
    marginTop:5,
    borderRadius:6
}