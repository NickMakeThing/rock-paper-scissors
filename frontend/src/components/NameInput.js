import React, { useState } from 'react'

export default function NameInput(props){
    const [inputValue, setInputValue] = useState(null)
    return (
        <div style={{textAlign:'center'}}>
            <input onChange={e=>setInputValue(e.target.value)}/>
            <button onClick={()=>createUserRequest(inputValue,props.setCurrentUser)}>Submit</button>
        </div>
    )
}

function createUserRequest(state,setState) {
    fetch('http://localhost:8000/create/',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            name:state
        })
    })
        .then(response => {
            if(response.ok){
                console.log('success')
                setState(state)
            } else {
                console.log('fetch error')
            }
        })
}