import React from 'react'

export default function LeaderBoard(props){
    return (
        <>
            <span 
                style={{cursor: 'pointer'}}
                onClick={e=>{e.stopPropagation();props.setLeaderBoard(true)}}>
                leaderboard{' '}
            </span>
            {showLeaderBoardModal(props.leaderBoard)}
        </>
    )
}

function showLeaderBoardModal(state){
    if(state){
        return <div style={modalStyle}></div>
    }
}
const modalStyle = {
    position:'absolute',
    height:'400px',
    width:'300px',
    backgroundColor: 'white',
    boxShadow: '0 0 0 1000px rgba(0,0,0,0.3)',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-65%)',
    zIndex:'1'
}