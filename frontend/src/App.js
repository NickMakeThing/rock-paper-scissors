import React, { useState } from 'react'
import Header from './components/Header'
import Game from './components/Game'
import LeaderBoard from './components/LeaderBoard'
import Spinner from './components/Spinner'
import FindOpponentButton from './components/FindOpponentButton'
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

    function displaySpinner(){
        return [<Header/>,<Spinner/>]
    }

    function showContent(){
        if (opponentName) {
            return <Game/>
        } else {
            return <FindOpponentButton 
                    error={error}
                    onClick={()=>findOpponentRequest(stateArgs)}/>
        }
    }
    
    if (loading) {
        return displaySpinner()
    }
    return  <div
                style={{height:'100%'}} 
                onClick={()=>setLeaderBoard(false)}>
                <Header
                    leaderBoard={leaderBoard}
                    setLeaderBoard={setLeaderBoard}/>
                {showContent(opponentName,false)}
                <input onChange={e=>setUserId(e.target.value)}/>put your userid for testing
            </div>
}

//-------------------------------------------------------------
//try var with ()=> ?
function findOpponentRequest(state) {
    state.setLoading(true)
    fetch('http://localhost:8000/find/'+state.userId,{
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
        .then(()=>state.setLoading(false))
        //.then(data => console.log(data))
}