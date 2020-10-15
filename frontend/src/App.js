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
    
    const game = <Game
        userId={userId} 
        opponentName={opponentName}/>
    const findOpponentButton = <FindOpponentButton
        userId={userId}
        stateControl={stateControl} 
        error={error}/>

    if (loading) { //do we put all this in a function? if yes, then many arguments: (loading,match,game,findOpponent)
        return displaySpinner()
    } else {
        if (match.connected) {
            var view = game
        } else {
            var view = findOpponentButton
        }
    }  //modal, view landing or page for name choosing???

    return  <div
                style={{height:'100%'}} 
                onClick={()=>setLeaderBoard(false)}>
                <Header
                    userId={userId}
                    leaderBoard={leaderBoard}
                    setLeaderBoard={setLeaderBoard}/>
                {view /*can become its own component?*/}
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