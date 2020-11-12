import React, { useState } from 'react'

export default function NameInput({userId, setCurrentUser}){
    const [inputValue, setInputValue] = useState(userId)
    const [showInput, setShowInput] = useState(false)
    var input
    if(showInput){
        input = <>
        <div style={{textAlign:'center'}}>
            <input onChange={e=>setInputValue(e.target.value)}/>
            <button onClick={()=>createUserRequest(inputValue,setCurrentUser)}>
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
    fetch('/create/',{
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
        .catch(err=>console.log(err))
}