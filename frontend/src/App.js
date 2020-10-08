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
    const stateArgs = {userId, setOpponentName, setLoading, setError}

    function setCurrentUser(name){
        window.localStorage.setItem('currentUser', name)
        setUserId(name)
    }
    function displaySpinner(){
        return [<Header/>,<Spinner/>]
    }

    function showContent(){
        if (opponentName) {
            return <Game/>
        } else {
            return <FindOpponentButton
                    stateArgs={stateArgs} 
                    error={error}/>
        }
    }
    useEffect(() => {    
        setUserId(window.localStorage.getItem('currentUser'))
    },[])

    if (loading) {
        return displaySpinner()
    }
    return  <div
                style={{height:'100%'}} 
                onClick={()=>setLeaderBoard(false)}>
                <Header
                    userId={userId}
                    leaderBoard={leaderBoard}
                    setLeaderBoard={setLeaderBoard}
                    setCurrentUser={setCurrentUser}/>
                {showContent(opponentName,false)}
                <NameInput setCurrentUser={setCurrentUser}/>
            </div>
}
