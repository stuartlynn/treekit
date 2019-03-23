import React, {useState} from 'react';
import {Link} from '@reach/router'

export default function Selfie(props) {
  const {species} = props.data
  return (
    <section>
      <div className="recentSpecies">
        {species && (
          <p>
            {species.CommonName} / {species.ScientificName}
          </p>
        )}
        <Link to="/species_picker">
          <button style={{width: '90%'}}>Lookup Species</button>
        </Link>
      </div>
    </section>
  );
}
