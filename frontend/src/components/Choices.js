import React from 'react'

export default function Choice(props){
    return (
        <div style={{textAlign:'center'}}>
            {displayChoices(props)}
        </div>
    )
}

function displayChoices(props) {
    return ['rock','paper','scissors'].map(choice =>{
        if(choice==props.chosen){
            return <div style={chosenStyle}>{choice}</div>
        } else {
            return (
                <div 
                    style={choiceStyle}
                    onClick={props.choiceClick}>
                    {choice}
                </div>
            )
        }
    })
}

const choiceStyle = {
    cursor:'pointer',
    display:'inline-block',
    lineHeight:'100px',
    height:'100px',
    width:'100px',
    margin:'5px',
    border: 'solid 1px #3AAFB9',
    backgroundColor:'#3AAFB9'
}

const chosenStyle = {...choiceStyle}
chosenStyle.border = 'solid 1px cyan'