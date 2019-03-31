import React, {useState, useContext} from 'react';
import MapLocationSelector from '../Componets/MapLocationSelector';
import {Link} from '@reach/router';
import CameraIcon from '@material-ui/icons/Camera';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {DataEntryStore} from '../Contexts/DataEntryContext';
import {SavedResultsStore} from '../Contexts/SavedResultsContext';
import DetailsFlow from '../Componets/DetailsFlow';

export default function ManualEntry(props) {
  const [state, dispatch] = useContext(DataEntryStore);
  const [savedResultsState, savedResultsDispatch] = useContext(SavedResultsStore);
  const completedStreets  = savedResultsState.streets
  const {circumference, health, selfie, species, stage, location} = state;

  const featureStyle = {
    zIndex: 10,
    width: '90%',
    margin: '0 5%',
    backgroundColor: '#99CA3E',
    overflowY: 'auto',
    position: 'absolute',
    bottom: '0px',
    maxHeight: '50%',
    boxShadow: '0px 0px 13px 3px rgba(0,0,0,0.75)',
    borderRadius: '10px 10px 0px 0px'
  };

  const initalPos = location ? location : [-73.96961503481516, 40.6801455107711] 
  return (
    <div id="ManualEntryPage" className="page">
      <MapLocationSelector
        style={{height: '100%', width: '100%'}}
        initalPosition={initalPos}
        onPositionChanged={(location)=> dispatch({
            type:'UPDATE_MAP',
            payload: {location}
            })}
        onStreetSelected={(selectedStreet)=>{
            dispatch({
            type: 'UPDATE_MAP',
            payload: {selectedStreet}
            })
        }}
        onGPSUpdated={(gps)=>{
            dispatch({
                type:"UPDATE_MAP",
                payload: {gps}
            })
        }}
        {...state.map}
        street = {state.street}
        currentStreetBed= {state.currentStreetBed}
        streetBeds= {state.streetBeds}
        completedStreets = {completedStreets}
      />
      <div className="features" style={featureStyle}>
        <DetailsFlow
          stage={stage}
          data={state}
          dispatch={dispatch}
          onDone={(result)=>{
            savedResultsDispatch({
                type: 'ADD_RESULT',
                payload: result
            })
          }}
        />
      </div>
    </div>
  );
}
