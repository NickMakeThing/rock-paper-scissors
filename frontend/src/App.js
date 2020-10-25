import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Game from './components/Game'
import LeaderBoard from './components/LeaderBoard'
import FindOpponentButton from './components/FindOpponentButton'
import NameInput from './components/NameInput'
import View from './components/View'
import Cookie from 'js-cookie'
//where to put css?
//sass/styled components

//-------------------------------------------------------------
export default function App(){
    const [opponentName, setOpponentName] = useState(null) 
    const [loading, setLoading] = useState(false)
    const [leaderBoard,setLeaderBoard] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userStats, setUserStats] = useState({})
    const [error, setError] = useState(null)
    const [match, setMatch] = useState({name:null, connected:false})
    const [webSocket, setWebSocket] = useState({})
    const stateControl = {setMatch, setOpponentName, setLoading, setError}
    
    useEffect(() => {    
        setUserId(window.localStorage.getItem('currentUser'))
    },[])

    useEffect(() => {   
        if(userId){
            getUserStats(setUserStats,userId)
        }
    },[userId])

    useEffect(() => {    
        if(match.name && !match.connected){
            setWebSocket(connectToMatch(match,setMatch))
        }
        if(match.connected){
            setLoading(false)
        }
    },[match])

    const findOpponentButton = <FindOpponentButton
        userId={userId}
        stateControl={stateControl} 
        error={error}/>

    const game = <Game
            findOpponentButton={findOpponentButton}
            userId={userId} 
            webSocket={webSocket}
            opponentName={opponentName}/>

    const setters = {setLeaderBoard, setDropDown}
    return  <div
                style={{height:'100%'}}
                onClick={()=>clearScreen(setters)}>
                <Header
                    userId={userId}
                    userData={userStats}
                    dropDown={dropDown}
                    leaderBoard={leaderBoard}
                    setDropDown={setDropDown}
                    setLeaderBoard={setLeaderBoard}/>
                <View
                    game={game}
                    match={match}
                    loading={loading}
                    userStats={userStats}
                    findOpponentButton={findOpponentButton}/>
                {/* <NameInput setCurrentUser={setCurrentUser}/> */}
            </div>
}

function clearScreen(setters){
    setters.setLeaderBoard(false)
    setters.setDropDown(false)
}

function setCurrentUser(name){
    window.localStorage.setItem('currentUser', name)
    setUserId(name) //doesnt work because outside of component
}

function connectToMatch(match,setMatch) {
    const webSocket = new WebSocket('ws://'+window.location.host+'/ws/match/'+match.name+'/')
    
    webSocket.onopen = function(e) {
        console.log('connected to match')
        setMatch({name:match.name,connected:true})
    }
    webSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        console.log(data)
    }
    webSocket.onclose = function(e) {
        console.error('socket closed.')
        setMatch({name:'',connected:false})
    }
    return webSocket
}

function getUserStats(setState,userId){
    fetch('http://localhost:8000/player/'+userId+'/')
        .then(response => response.json())
        .then(data => setState(data))//????
}
