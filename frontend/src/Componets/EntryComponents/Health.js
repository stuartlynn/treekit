import React, {useState} from 'react';

export default function Health(props) {
  const {health} = props.data

  return (
    <section>
      <div className="health">
        {['Alive', 'Dead', 'Stump', 'Empty'].map(state => (
          <button
            style={{
              backgroundColor: health === state ? '#729530' : '#565757',
            }}
            onClick={() => props.onChange({health:state})}>
            {state}
          </button>
        ))}
      </div>
    </section>
  );
}
