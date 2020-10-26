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

const buttonStyle={
    fontSize:'75%',
    marginTop:20,
    width:150,
    height:50
}