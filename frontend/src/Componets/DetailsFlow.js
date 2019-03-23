import React, {useState, useEffect} from 'react';
import BedLocation from './EntryComponents/BedLocation';
import Species from './EntryComponents/Species';
import SelectStreet from './EntryComponents/SelectStreet';
import SelectStreetDetails from './EntryComponents/SelectStreetDetails';
import Measurement from './EntryComponents/Measurement';
import Health from './EntryComponents/Health';
import Selfie from './EntryComponents/Selfie';

export default function(props) {
  const {stage, data, dispatch} = props;
  const steps = {
    SelectStreet: {
      component: SelectStreet,
      next: 'SelectStreetDetails',
      onActivate: () => {
        dispatch({
          type: 'UPDATE_MAP',
          payload: {
            interaction: true,
            selectStreetActive: true,
            showBlocks:true
          },
        });
      },
      onSubmit: result => {
        dispatch({
          type: 'UPDATE_MAP',
          payload: {
            interaction: false,
            selectStreetActive: false,
            zoomToExtent: result.extent,
          },
        });
        dispatch({
          type: 'UPDATE_STREET',
          payload: result,
        });
      },
    },
    SelectStreetDetails: {
      component: SelectStreetDetails,
      next: 'BedLocation',
      onActivate: () => {
        dispatch({
          type: 'UPDATE_MAP',
          payload: {
            showStreetDirection: true,
            showStreetSide: true,
            showBlocks:false
          },
        });
      },
      onChange: updates => {
        dispatch({
          type: 'UPDATE_STREET',
          payload: updates,
        });
      },
      onSubmit: result => {},
    },
    BedLocation: {
      component: BedLocation,
      next: 'Species',
    },
    Species: {
      component: Species,
      next: 'Measurement',
    },

    Measurement: {
      component: Measurement,
      next: 'Health',
    },
    Health: {
      component: Health,
      next: 'Selfie',
    },
    Selfie: {
      component: Selfie,
      next: {doneOr: 'Location'},
    },
  };

  const CurrentStep = steps[stage];
  useEffect(() => {
    if (CurrentStep.onActivate) {
      CurrentStep.onActivate();
    }
  }, [stage]);

  const submit = result => {
    if (CurrentStep.onSubmit) {
      CurrentStep.onSubmit(result);
      dispatch({
        type: 'SET_STAGE',
        payload: CurrentStep.next,
      });
    }
  };

  const change = updates => {
    if (CurrentStep.onChange) {
      CurrentStep.onChange(updates);
    }
  };

  return (
    <div>
      {/*<div style={{dispaly: 'flex', minHeight:'20%'}}>
        {Object.keys(steps).map(o => (
          <span style={{fontSize: '11px'}} onClick={() => props.onSetStage(o)}>
            {o}>{' '}
          </span>
        ))}
      </div>*/}
      <CurrentStep.component
        onSubmit={submit}
        data={props.data}
        onChange={change}
      />
    </div>
  );
}
