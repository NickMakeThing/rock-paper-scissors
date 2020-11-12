import React from 'react'
export default function FindOpponentButton({userId,stateControl}){
    return (
        <>
            {/* <span 
                style={{color:'red'}}>
                {props.error}
            </span><br/> */}
            <button style={buttonStyle}
                onClick={()=>findOpponent(stateControl,userId)}>
                Play Now
            </button>
        </>
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
 
        console.error('socket closed: match finding complete or a.')
    }
    setTimeout(() => {
        console.log('userId sent')
        webSocket.send(userId)
    }, 1000)
}

const buttonStyle={
    fontSize:44,
    width:259,
    height:89,
    borderRadius:10
}