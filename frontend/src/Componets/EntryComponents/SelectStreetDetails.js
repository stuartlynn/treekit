import React, {useState} from 'react';

export default function SelectStreetDetails(props) {
  const {street} = props.data;
  const {direction,side} = street

  const update = (updates)=>{
    if(props.onChange){
        props.onChange(updates) 
    }
  }

  const submit =()=>{
    if(props.onSubmit){
        props.onSubmit()
    }
  }

  return (
    <div>
      <h3>
        Select the direction you are going to walk along the street and the side that 
        the trees are on.
      </h3>
      {street &&
         <div>
             <p>Street Direction: {direction}</p>
             <button onClick={()=>update({direction:'Forward'})}>Forward</button>
             <button onClick={()=>update({direction: 'Backward'})}>Backward</button>
            <p>Tree side: {side} </p>
            <button onClick={()=>update({side:'Left'})}>Left</button>
            <button onClick={()=>update({side:'Right'})}>Right</button>
        </div>
      }
      <button onClick={submit}>Submit</button>
    </div>
  );
}
