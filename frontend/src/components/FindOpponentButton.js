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
                onClick={()=>findOpponent(props.stateControl,props.userId)}>
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
  

//stateControl = {setOpponentName, setLoading, setError}
function findOpponent(state,userId) {
    state.setLoading(true)
    const webSocket = new WebSocket('ws://'+window.location.host+'/ws/find_match/')

    webSocket.onopen = function(e) {
        console.log('connected: looking for match')
    }
    webSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        webSocket.close()
        console.log(data.match_name)
        state.setOpponentName(data.opponent)
        state.setMatch({name:data.match_name,connected:false})
    }
    webSocket.onclose = function(e) {
        //todo: if not successfully retrieved match name, setloading(false)
        console.error('socket closed: match finding complete or a.')
    }
    setTimeout(() => {
        console.log('userId sent')
        webSocket.send(userId)
    }, 1000)
}

