import React from 'react'
export default function FindOpponentButton(props){
    return (
        <span>
            <span 
                style={{color:'red'}}>
                {props.error}
            </span><br/>
            <button style={buttonStyle}
                onClick={()=>findOpponent(props.stateControl,props.userId)}>
                Play Now
            </button>
        </span>
    )
}


//stateControl = {setOpponentName, setLoading, setError}
function findOpponent(state,userId) {
    state.setLoading(true)
    const webSocket = new WebSocket('ws://'+window.location.host+'/ws/find_match/')
    webSocket.match_found = false
    
    webSocket.onopen = function(e) {
        console.log('connected: looking for match')
    }
    webSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        webSocket.match_found = data.match_name
        webSocket.close()
        console.log(data.match_name)
        state.setOpponentName(data.opponent)
        state.setMatch({name:data.match_name,connected:false})
    }
    webSocket.onclose = function(e) {
        if(!webSocket.match_found){
            state.setLoading(false)
        }
        console.error('socket closed: match finding complete or a.')
    }
    setTimeout(() => {
        console.log('userId sent')
        webSocket.send(userId)
    }, 1000)
}

const buttonStyle={
    fontSize:'75%',
    marginTop:20,
    width:150,
    height:50
}