import React, {useState, useContext, useReducer} from 'react';

const maxRecentSpecies = 3;
const initalState = {
  recentSpecies: [],
  stage: 'SelectStreet',
  tree:{
      selfie: null,
      circumference: 20,
      health: 'Alive',
      location: null,
      street: null,
  },
  street: {
      name: '',
      id: '',
      direction:'Forward',
      side:'Left'
  },
  currentStreetBed:{
  
  },
  currentStreetBeds:[],
  map:{
    selectStreet: null,
    showEndpoints: false,
    gps:null,
    zoomToExtent:null,
    streetSelectActive: true,
    position: null,
    showBlocks: true
  }
};

const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'UPDATE_TREE':
      //console.log('updating Tree Property ', action);
      return {...state, tree: {...state.tree, ...payload}};
    case 'UPDATE_STREET':
      //console.log('updating STRETT Property ', action);
      return {...state, street: { ...state.street,...payload}};
    case 'UPDATE_MAP':
      //console.log('updating MAP Property ', action);
      return {...state, map:{...state.map,...payload}};
    case 'UPDATE_BeG':
      //console.log('updating MAP Property ', action);
      return {...state, currentStreetBed:{...state.currentStreetBed,...payload}};
    case 'CLEAR_TREE_STATE':
      return {...state, tree: initalState.tree};
    case 'CLEAR_STREET_STATE':
      return {...state, street: initalState.street};
    case 'CLEAR_MAP_STATE':
      return {...state, map:initalState.map}
    case 'SET_STAGE':
      return {...state, stage: payload};
    case 'ADD_TO_RECENT_SPECIES':
      return {
        ...state,
        recentSpecies: state.recentSpecies.find(
          s => s.CommonName === payload.CommonName,
        )
          ? state.recentSpecies
          : [payload, ...state.recentSpecies].slice(0, maxRecentSpecies),
      };
    default:
      return state;
  }
};

export const DataEntryStore = React.createContext();

export const DataEntryProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <DataEntryStore.Provider value={[state, dispatch]}>
      {children}
    </DataEntryStore.Provider>
  );
};
