import React from 'react'

export default function Spinner(){
    return (
        <h1 style={spinnerStyle}>spinner</h1>
    )
}

const spinnerStyle={
    lineHeight: '300px',
    width: '300px',
    height: '300px',
    backgroundColor: 'green',
    fontSize: '500%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-75%)'
}
