import React, {useState} from 'react';

export default function Measurement(props) {
  const {circumference} = props.data;

  const update = (change)=>{
    if(props.onChange){
        props.onChange(change)
    }
  }

  const submit = ()=>{
    if(props.onSubmit){
        props.onSubmit()
    }
  }

  return (
    <section>
      <h2>Dimensions</h2>
      <div className="dimensions">
        <p>Circumference</p>
        <input
          type="text"
          value={circumference}
          onChange={e => props.onChange({circumference: e.target.value})}
        />
      </div>

      <button onClick={submit}>Submit</button>
    </section>
  );
}
