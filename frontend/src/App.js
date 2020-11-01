import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Game from './components/Game'
import FindOpponentButton from './components/FindOpponentButton'
import View from './components/View'

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
        var currentUser = window.localStorage.getItem('currentUser')
        if(currentUser){
            setUserId(currentUser)
        } else {
            setLoading(true)
            createUserRequest(newUser=>{
                setUserId(newUser)
                setLoading(false)
            })
        }
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

    function updateUserStats(ratingChange,result){
        var userStatsCopy={...userStats}
        userStatsCopy.score += ratingChange
        if(result=='win'){
            userStatsCopy.wins+=1
        } else {
            userStatsCopy.losses+=1
        }
        setUserStats(userStatsCopy)
        return userStatsCopy.score
    }

    const findOpponentButton = <FindOpponentButton
        userId={userId}
        stateControl={stateControl} 
        error={error}/>

    const game = <Game
        userId={userId} 
        webSocket={webSocket}
        opponentName={opponentName}
        userStats={userStats}
        updateUserStats={updateUserStats}
        findOpponentButton={findOpponentButton}/>

    const setters = {setLeaderBoard, setDropDown}
    return  <div
                style={mainContainerStyle}
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

function createUserRequest(setState) {
    fetch('http://localhost:8000/create/',{
        method:'POST'
    })
        .then(response => response.json())
        .then(data=>{
            setCurrentUser(data.name)
            setState(data.name)
        })
        .catch(err=>console.log(err))
}

const mainContainerStyle={
    height:'100%'
}