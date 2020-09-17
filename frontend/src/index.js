import React from 'react'
import { render } from 'react-dom'
import App from './App'
import 'styles.css'

//why does root have E1 on it?
//where is the rootdiv?
//react 'strictmode' component?
//where is a div with id='app' created?

const rootE1 = document.getElementById('app')
render(<App />, rootE1)

