import React from 'react'
import Spinner from './Spinner'
import LandingView from './LandingView'
export default function View({game, match, loading, userStats, findOpponentButton}){

    if (loading) { 
        var view = <Spinner/>
    } else {
        if (match.connected) {
            var view = game
        } else {
            var view = <LandingView
                userStats = {userStats}
                findOpponentButton = {findOpponentButton}/>
        }
    }  
    return(
        <div style={viewContainerStyle}>
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
