import React from 'react';
import SpeciesPicker from '../Componets/SpeciesPicker';

export default function ManualEntry(props) {
  return (
    <div id="ManualEntryPage" className="page">
      <h1>Manual Entry</h1>
      <SpeciesPicker style={{width:'100%', height:'2rem'}} />
    </div>
  );
}
