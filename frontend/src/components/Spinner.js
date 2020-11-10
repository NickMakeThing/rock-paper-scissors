import React from 'react'
import spinner from './images/spinner.gif'

export default function Spinner(){
    return (<>
        {/* <div>Searching for match...</div> */}
        <img src={spinner} style={spinnerStyle}/>
    </>)
}

const spinnerStyle={
    lineHeight: '300px',
    width: '300px',
    height: '300px',
    filter: 'blur(1px)'
}
