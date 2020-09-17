import React, { useState } from 'react'
import Header from './components/Header'
import Game from './components/Game'
import LeaderBoard from './components/LeaderBoard'
import Spinner from './components/Spinner'
import FindOpponentButton from './components/FindOpponentButton'
//where to put css?
//

//-------------------------------------------------------------
export default function App(){
    const [opponentName, setOpponentName] = useState(null) 
    const [loading, setLoading] = useState(false)
    const [leaderBoard,setLeaderBoard] = useState(false)

    const showGame = () => {
        if(!opponentName){
            setOpponentName('jeff')
        } else {
            setOpponentName(null)        
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
                {showContent(opponentName,showGame)}
            </div>
}

//-------------------------------------------------------------
function displaySpinner(){
    return [<Header/>,<Spinner/>]
}

function showContent(state,callback){
    if (state) {
        return <Game/>
    } else {
        return <FindOpponentButton onClick={callback}/>
    }
}
