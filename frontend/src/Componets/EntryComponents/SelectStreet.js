import React, {useState} from 'react';

export default function SelectStreetStartPoint(props) {
  const {selectedStreet} = props.data.map;

  const submit = ()=>{
    const extent = selectedStreet.getGeometry().getExtent();
    const {id, linelength} = selectedStreet

    props.onSubmit({
        extent,
        id,
        linelength,
        feature: selectedStreet
    })
  }
  return (
    <div>
      <h3>
        Place the marker over the street to select the one you want to work om{' '}
      </h3>
      {selectedStreet && 
         <div>
          <p>Street ID: {selectedStreet.getProperties().id}</p>
          <p>Street Length: {selectedStreet.getProperties().linelength.toFixed(2)}m</p>
        </div>
      }
      <button onClick={submit}>Submit</button>
    </div>
  );
}
