import React from 'react'
import rock from './images/rock.jpg'
import paper from './images/paper.jpg'
import scissors from './images/scissors.png'
export default function Choice(props){
    return (
        <div style={{textAlign:'center'}}>
            {displayChoices(props)}
        </div>
    )
}

function displayChoices(props) {
    return [
        {image:rock, name:'rock'},
        {image:paper, name:'paper'}, 
        {image:scissors, name:'scissors'}
    ].map(choice =>{
        if(choice.name==props.chosen){
            return <img src={choice.image} 
                style={chosenStyle}
                width={100} 
                heigh={100}/>
        } else {
            return <img src={choice.image} 
                id={choice.name}
                style={choiceStyle}
                onClick={props.choiceClick}
                width={100} 
                heigh={100}/>
        }
    })
}

const choiceStyle = {
    cursor:'pointer',
    display:'inline-block',
    lineHeight:'100px',
    width:100, //
    height:100, // stretches rock horizontally
    margin:'5px',
    border:'solid 2px #bbc0c4',
    borderRadius:10

}

const chosenStyle = {...choiceStyle}
chosenStyle.border = 'solid 2px #6cbbf7'
//chosenStyle.boxShadow = '0 0 0 4px rgba(0,149,225,0.15)'