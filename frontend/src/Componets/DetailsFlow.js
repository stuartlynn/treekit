import React, {useState, useEffect} from 'react';
import BedLocation from './EntryComponents/BedLocation';
import Species from './EntryComponents/Species';
import SelectStreet from './EntryComponents/SelectStreet';
import SelectStreetDetails from './EntryComponents/SelectStreetDetails';
import Measurement from './EntryComponents/Measurement';
import Health from './EntryComponents/Health';
import Summary from './EntryComponents/Summary';
import Selfie from './EntryComponents/Selfie';
import {constructBedGeometry} from '../Utils'

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
            showBlocks: true,
          },
        });
      },
      onSubmit: result => {
        console.log("SUBMITTING STEP Select Street")
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
		dispatch({
			type: "SET_FOCUS",
			payload: 'street'
		})

        console.log("SUBMITTED STEP Select Street")
        return false;
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
            showBlocks: false,
          },
        });
        console.log("ACTIVATED Select Street")

      },
      onChange: updates => {
        dispatch({
          type: 'UPDATE_STREET',
          payload: updates,
        });
      },
      onSubmit: result => {
        if (result === 'no_trees') {
          dispatch({
            type: 'UPDATE_STREET',
            payload: {is_empty: true},
          });
          return true;
        }
        return false;
      },
    },
    BedLocation: {
      component: BedLocation,
      next: 'Species',
	  onActivate: ()=>{
	  },
      onChange: updates => {
        const bed = constructBedGeometry({...data.currentStreetBed, ...updates}, props.data.street)
        dispatch({
          type: 'UPDATE_ACTIVE_BED',
          payload: {...updates,geom:bed}
        });
      },
    },
    Species: {
      component: Species,
      next: 'Measurement',
      onChange: update => {
        console.log('UPDATING TREE');
        dispatch({
          type: 'UPDATE_TREE',
          payload: update,
        });
      },
    },
    Measurement: {
      component: Measurement,
      next: 'Health',
      onChange: update => {
        dispatch({
          type: 'UPDATE_TREE',
          payload: update,
        });
      },
    },
    Health: {
      component: Health,
      next: 'Selfie',
      onChange: update => {
        dispatch({
          type: 'UPDATE_TREE',
          payload: update,
        });
      },
    },
    Selfie: {
      component: Selfie,
      onChange: update => {
        dispatch({
          type: 'UPDATE_TREE',
          payload: update,
        });
      },
      next:'Summary'
    },
    Summary:{
      component: Summary,
      onActivate:()=>{
        dispatch({
            type:'SAVE_ACTIVE_BED',
        })
        dispatch({
            type:'SAVE_ACTIVE_TREE',
        })
      },
      onSubmit: end => {
        if(end){
            return true 
        }

        else{
            const {currentStreetBed} = props.data
            dispatch({
                type:'RESET_TREE',
                payload: currentStreetBed
            })

            dispatch({
                type:'START_ACTIVE_BED',
                payload: {
                    depth: currentStreetBed.depth,
                    width: currentStreetBed.width,
                    previousBedEnd: currentStreetBed.absoluteEnd,
                    absoluteStart: currentStreetBed.absoluteEnd,
                    absoluteEnd: currentStreetBed.absoluteStart + currentStreetBed.width
                }
            })

        }
      },
      next:'BedLocation'
    }
  };

  const CurrentStep = steps[stage];
  useEffect(() => {
    if (CurrentStep.onActivate) {
      CurrentStep.onActivate();
    }
  }, [stage]);

  const submit = result => {
    if (CurrentStep.onSubmit) {
      const done = CurrentStep.onSubmit(result);
      if (done) {
        props.onDone({
          beds: data.streetBeds,
          trees: data.trees,
          street: data.street,
        });
        dispatch({
          type: 'RESTART',
        });
      } else {
        dispatch({
          type: 'SET_STAGE',
          payload: CurrentStep.next,
        });
      }
    } else {
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
