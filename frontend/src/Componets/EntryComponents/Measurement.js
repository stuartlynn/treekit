import React, {useState} from 'react';

export default function Measurement(props) {
  const {circumference} = props.data;
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
    </section>
  );
}
