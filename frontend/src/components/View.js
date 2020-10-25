import React from 'react'
import Spinner from './Spinner'

export default function View(props){
    const game = props.game
    const match = props.match
    const loading = props.loading
    const userStats = props.userStats
    const findOpponentButton = props.findOpponentButton

    if (loading) { //do we put all this in a function? if yes, then many arguments: (loading,match,game,findOpponent)
        var view = <Spinner/>
    } else {
        if (match.connected) {
            var view = game
        } else {
            var view = <>
                <div>
                    Play rock paper scissors against other people
                    {findOpponentButton}
                </div>
                <div style={horizontalLineStyle}/>
                <div>
                    <div>your stats</div>
                    <div>wins: {userStats.wins}</div>
                    <div>losses: {userStats.losses}</div>
                    <div>score: {userStats.score}</div>
                    
                </div>
            </>
        }
    }  //modal, view landing or page for name choosing???
    return(
        <div style={viewContainerStyle}>{/*can become its own component?*/}
            {view}
        </div> 
    )
}

const viewContainerStyle = {
    fontSize:'200%',
    display:'flex',
    flexDirection:'column',
    height:'100vh',
    alignItems:'center',
    justifyContent:'center'
}
const horizontalLineStyle = {
    width:'60vh',
    height:1,
    backgroundColor:'black'
}