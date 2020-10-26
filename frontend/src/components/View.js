import React from 'react'
import Spinner from './Spinner'
import LandingView from './LandingView'
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
            var view = <LandingView
                userStats = {userStats}
                findOpponentButton = {findOpponentButton}/>
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
    minHeight:'calc(100% - 70px)',
    alignItems:'center',
    justifyContent:'center',
    // position:'relative',
    // top:-70 //centers it to screen as opposed to space under header, but overlaps header when window resize vertically 
}
