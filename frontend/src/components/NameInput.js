import React, { useState } from 'react'

export default function NameInput(props){
    const [inputValue, setInputValue] = useState(props.userId)
    const [showInput, setShowInput] = useState(false)
    var input
    if(showInput){
        input = <>
        <div style={{textAlign:'center'}}>
            <input onChange={e=>setInputValue(e.target.value)}/>
            <button onClick={()=>createUserRequest(inputValue,props.setCurrentUser)}>
                Submit
            </button>
        </div></>
    }
    return <div>
        <button onClick={()=>setShowInput(!showInput)}>Change Name</button>
        {input}
    </div>
}

function createUserRequest(username,setCurrentUser) {
    fetch('http://localhost:8000/create/',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            name:username
        })
    })
        .then(response => {
            if(response.ok){
                console.log('success')
                setCurrentUser(username)
            } else {
                console.log('fetch error')
            }
        })
}