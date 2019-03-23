import React, {useContext} from 'react';
import SpeciesPicker from '../Componets/SpeciesPicker';
import {DataEntryStore} from '../Contexts/DataEntryContext';

export default function SpeciesPickerPage(props) {
  const [state, dispatch] = useContext(DataEntryStore);
  return (
    <div id="SpeciesPickerPage" className="page">
      <SpeciesPicker
        style={{width: '100%', height: '100%'}}
        onConfirm={species => {
          dispatch({
            type: 'UPDATE_PROPERTY',
            payload: {
              species,
            },
          });

          dispatch({
            type: 'ADD_TO_RECENT_SPECIES',
            payload:species
          })
          props.navigate('/map_entry');
        }}
        onReject={() => props.navigate('/map_entry')}
      />
    </div>
  );
}
