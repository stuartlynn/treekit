import React, {useState} from 'react';

export default function Health(props) {
  const {health} = props.data.tree
 
  const update = (changes)=>{
    if(props.onChange){
        props.onChange(changes)
    }
  }
  const submit = ()=>{
    if(props.onSubmit){
        props.onSubmit()
    }
  }

  return (
    <section>
      <div className="health">
        {['Alive', 'Dead', 'Stump', 'Empty'].map(state => (
          <button
            style={{
              backgroundColor: health === state ? '#729530' : '#565757',
            }}
            onClick={() => update({health:state})}>
            {state}
          </button>
        ))}
        <button onClick={submit}>Submit</button>
      </div>
    </section>
  );
}
