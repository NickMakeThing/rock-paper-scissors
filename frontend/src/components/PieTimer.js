import React, { useRef, useState, useEffect } from 'react'

    export default function PieTimer({time}){
    const canvasRef = useRef()
    const [roundTime, setRoundTime] = useState(0)

    useEffect(() => {
        if(time){
            var date = new Date
            var startTime = date.getTime()//this would break if client in different timezone.
            //possible fix: set the timezone to get date/time from
            setRoundTime(30-((startTime - time)/1000)%30)

            var tick = () => {
                    setRoundTime(roundTime => {
                        if(roundTime > 0.05){
                            var date = new Date
                            var newTime = date.getTime()
                            return 30-((newTime - time)/1000)%30
                        } else {
                            return 0
                        }
                    })
            }
            const repeat = setInterval(tick, 50)
            return () => {
                clearInterval(repeat)
            }
        }
    },[time])
    // useEffect(() => {
    //     if (canvasRef.current) {
    //         const renderCtx = canvasRef.current.getContext('2d');
    //         setContext(renderCtx)
    //     }
    // }, [context])
    if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d')
        if(context){
            var timePassed = (2/30)*(30-roundTime)
            var num = 1.5+timePassed//1.5 is start of timer, timer finishes when num gets to 3.5
            // console.log('rerender',roundTime, num)
            context.clearRect(0,0,200,200)
            // context.fillStyle = "blue"
            // context.fill()
            context.lineWidth = 1
            context.beginPath()
            roundTime > 0.05 && context.moveTo(55, 51)
            context.arc(55, 51, 50, num*Math.PI , 3.5 * Math.PI)
            roundTime > 0.05 && context.lineTo(55,51)
            // context.strokeStyle='skyblue'
            context.stroke()
            if(time){
                context.font = '50px Arial'
                context.fillStyle='black'
                context.fillText(Math.floor(roundTime),25,68)
            }
        }
    }
    
    
    return <canvas
        ref={canvasRef}
        height={110}
        width={110}/>
}
