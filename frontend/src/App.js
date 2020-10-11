import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Game from './components/Game'
import LeaderBoard from './components/LeaderBoard'
import Spinner from './components/Spinner'
import FindOpponentButton from './components/FindOpponentButton'
import NameInput from './components/NameInput'
import Cookie from 'js-cookie'
//where to put css?
//sass/styled components

//-------------------------------------------------------------
export default function App(){
    const [opponentName, setOpponentName] = useState(null) 
    const [loading, setLoading] = useState(false)
    const [leaderBoard,setLeaderBoard] = useState(false)
    const [userId, setUserId] = useState(null)
    const [error, setError] = useState(null)
    const [match, setMatch] = useState({name:null, connected:false})
    const stateControl = {setMatch, setOpponentName, setLoading, setError}

    useEffect(() => {    
        setUserId(window.localStorage.getItem('currentUser'))
    },[])

    function showContent(){ //showView or make view = component, put view in big return
        if (match.connected) {
            return <Game/>
        } else {
            return findOpponentButton
        }
    } //modal, view landing or page for name choosing???

    const findOpponentButton = <FindOpponentButton
        userId={userId}
        connectToMatch={connectToMatch}
        stateControl={stateControl} 
        error={error}/>

    if (loading) {
        return displaySpinner()
    }

    return  <div
                style={{height:'100%'}} 
                onClick={()=>setLeaderBoard(false)}>
                <Header
                    userId={userId}
                    leaderBoard={leaderBoard}
                    setLeaderBoard={setLeaderBoard}/>
                {showContent()}
                <NameInput setCurrentUser={setCurrentUser}/>
            </div>
}

function displaySpinner(){
    return [<Header/>,<Spinner/>]
}

function setCurrentUser(name){
    window.localStorage.setItem('currentUser', name)
    setUserId(name)
}

function connectToMatch(state, match) {
    const webSocket = new WebSocket('ws://'+window.location.host+'/ws/'+match+'/')
    webSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        console.log(data)
    }
    webSocket.onclose = function(e) {
        console.error('socket closed.')
    }
}