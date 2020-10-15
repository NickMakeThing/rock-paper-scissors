import React, { useState } from 'react'
import Choices from './Choices.js'
import Display from './Display.js'


export default function Game(props){
    const [chosen, setChosen] = useState(null)
    const choiceClick = e => {
        setChosen(e.target.innerText)
    }
    
    return (
        <>
            <Display 
                userId={props.userId}
                opponentName={props.opponentName}/>
            <Choices
                chosen={chosen}
                choiceClick={choiceClick}/>
            <button>Select</button>
        </>
    )
}

