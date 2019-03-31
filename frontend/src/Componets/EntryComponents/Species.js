import React, {useState} from 'react';
import {Link} from '@reach/router'
import SpeciesPicker from '../SpeciesPicker' 

export default function Selfie(props) {
  const {species} = props.data.tree
    
  const submit  = (species)=>{
    if(props.onSubmit){
        props.onSubmit(species)
    }
  }

  const update = (species)=>{
    if(props.onChange){
        props.onChange(species)
    }
  }

  return (
    <section>
      <h1>Select a species</h1>
      <div className="recentSpecies">
        {species ? 
            <p> {species.CommonName} <img src ={species.leafImage} /></p>
        :
        <SpeciesPicker 
            onConfirm= {(species)=>update({species})}
        />
        }
        
      <h3>How sure are you?</h3>

      <button onClick={submit} >Submit</button>
    
      </div>
    </section>
  );
}
