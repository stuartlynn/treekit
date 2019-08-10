import React, {useState} from 'react';

export default function SelectStreetStartPoint(props) {
  const {street} = props.data;
  
  const submit = ()=>{
    if(props.onSubmit){
        delete street.geometry 
        props.onSubmit({
           street
        })
        
    }
  }
  console.log('street is ',street)
  return (
    <div>
      <h3>
        Place the marker over the street to select the one you want to work om{' '}
      </h3>
      {street && 
         <div>
          <p>Street: {street.name}</p>
          <p>Street Length: {street.length.toFixed(2)}m</p>
        </div>
      }
      <button onClick={submit}>Submit</button>
    </div>
  );
}
