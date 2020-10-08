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
                onClick={()=>findOpponent(props.stateArgs)}>
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
//stateArgs = {userId, setOpponentName, setLoading, setError}
function findOpponent(state) {
    state.setLoading(true)
    const webSocket = new WebSocket('ws://'+window.location.host+'/ws/find_match/')
    webSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        console.log(data)
    }
    webSocket.onclose = function(e) {
        console.error('socket closed.')
    }
    /*webSocket.send(JSON.stringify({
        'message': message
    }))
    /////
    fetch('http://localhost:8000/ws/'+state.userId,{
        method:'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            looking_for_opponent:true
        })
    })
        .then(response => {
            if(response.ok){
                //console.log(response) //before 'converting to json'
                response.json()
                state.setError(null)
                console.log('success')
            } else {
                state.setError('fetch error')
                console.log('fetch error')
            }
        })
        .then(()=>state.setLoading(false))*/
        //.then(data => console.log(data))
}