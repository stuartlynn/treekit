import React, {useState, useContext, useReducer, useEffect} from 'react';

const maxRecentSpecies = 3;
const initalState = {
  projects: [],
  neighborhoods: [],
  streets: [],
  offlineNeighborhoods:[],
  focusOn: 'neighborhood',

  recentSpecies: [],
  stage: 'SelectStreet',
  tree: {
    selfie: null,
    circumference: 20,
    health: 'Alive',
    location: null,
    street: null,
    species: null,
  },
  street: {
    name: '',
    id: '',
    direction: 'Forward',
	length: 0,
    side: 'Left',
    isEmpty: false,
    geom: null,
  },
  currentStreetBed: {
    width: 6.5,
    depth: 4.5,
    distance: 0,
    absoluteStart: 0,
    absoluteEnd: 0.5,
    previousBedEnd: null,
  },
  streetBeds: [],
  trees: [],
  map: {
    selectStreet: null,
    gps: null,
    zoomToExtent: null,
    streetSelectActive: true,
    position: null,
    showBlocks: true,
    showCurrentBed: false,
  },
};

const reducer = (state, action) => {
  const {type, payload} = action;
  console.log('STATE IS ', state);
  switch (type) {
    case 'UPDATE_TREE':
      //console.log('updating Tree Property ', action);
      return {...state, tree: {...state.tree, ...payload}};
    case 'UPDATE_STREET':
      //console.log('updating STRETT Property ', action);
      return {...state, street: {...state.street, ...payload }};
    case 'UPDATE_MAP':
      //console.log('updating MAP Property ', action);
      return {...state, map: {...state.map, ...payload}};
    case 'UPDATE_ACTIVE_BED':
      //console.log('updating MAP Property ', action);
      return {
        ...state,
        currentStreetBed: {...state.currentStreetBed, ...payload},
      };
    case 'SAVE_ACTIVE_BED':
      //console.log('updating MAP Property ', action);
      return {
        ...state,
        streetBeds: [...state.streetBeds, state.currentStreetBed],
      };
    case 'SAVE_ACTIVE_TREE':
      //console.log('updating MAP Property ', action);
      return {...state, trees: [...state.trees, state.tree]};

	case 'SET_FOCUS':
		return {...state,focusOn : payload} 

    case 'START_ACTIVE_BED':
      return {
        ...state,
        currentStreetBed: {
          ...initalState.currentStreetBed,
          ...payload,
        },
      };
    case 'CLEAR_TREE_STATE':
      return {...state, tree: initalState.tree};
    case 'CLEAR_STREET_STATE':
      return {...state, street: initalState.street};
    case 'CLEAR_MAP_STATE':
      return {...state, map: initalState.map};
    case 'SET_STAGE':
      return {...state, stage: payload};
    case 'RESET_TREE':
      return {...state, tree: initalState.tree};
    case 'UPDATE_PROJECTS':
      return {...state, projects: payload};
    case 'ADD_OR_UPDATE_PROJECT':
      if (state.projects.find(p => p.id === payload.id)) {
        return {
          ...state,
          projects: state.projects.map(p =>
            p.id === payload.id ? {...p, ...payload} : p,
          ),
        };
      } else {
        return {...state, projects: [...state.projects, payload]};
      }
    case 'ADD_OR_UPDATE_NEIGHBORHOOD':
      if (state.neighborhoods.find(p => p.id === payload.id)) {
        return {
          ...state,
          neighborhoods: state.neighborhoods.map(p =>
            p.id === payload.id ? {...p, ...payload} : p,
          ),
        };
      } else {
        return {...state, neighborhoods: [...state.neighborhoods, payload]};
      }
    case 'UPDATE_NEIGHBORHOODS':
      return {...state, neighborhoods: payload};
    case 'RESTART':
      return initalState;
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

  const {offlineNeighborhoods, neighborhoods, streets, projects} = state;
  useEffect(() => {
    const neighborhoodsForOffline = neighborhoods.filter(nh =>
      offlineNeighborhoods.includes(nh.id),
    );

	const streetsForOffline = streets.filter(s=> offlineNeighborhoods.includes(s.neighborhoodId))

    window.localStorage.setItem(
      'neighborhoods',
      JSON.stringify(neighborhoodsForOffline),
    );
    window.localStorage.setItem(
      'streets',
      JSON.stringify(neighborhoodsForOffline),
    );

    window.localStorage.setItem('projects', JSON.stringify(projects));
  }, [streets, projects, neighborhoods, offlineNeighborhoods]);

  return (
    <DataEntryStore.Provider value={[state, dispatch]}>
      {children}
    </DataEntryStore.Provider>
  );
};
