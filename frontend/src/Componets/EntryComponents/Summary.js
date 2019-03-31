import React from 'react'

export default function Summary(props){
    const submit = (done)=>{
        if(props.onSubmit){
            props.onSubmit(done)
        }
    }
    
    return(
        <div>
            <h3>Summary</h3>
            <button onClick={()=>submit(false)}>Add Another</button>
            <button onClick={()=>submit(true)}>Done</button>
        </div>
    )
}
