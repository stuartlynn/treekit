import React, {useState, useContext, useReducer,useEffect} from 'react';

const initalState = {
  streets: [],
  beds:[],
  trees:[],
  cache_loaded: false
}

const reducer = (state, action) => {
    const {type,payload} = action
    switch(type){
        case "LOAD_CACHED_STATE":
            return  payload

        case "ADD_RESULT":
            return {
                ...state,
                streets: [...state.streets,payload.street],
                beds:    [...state.beds, ...payload.beds],
                trees:   [...state.trees, ...payload.trees] 
            }
        default:
            return state 
    }
}

export const SavedResultsStore = React.createContext();

export const SavedResultsProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    if (state.cache_loaded) {
      localStorage.setItem('state', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const cachedState = JSON.parse(localStorage.getItem('state'));

    dispatch({
      type: 'LOAD_CACHED_STATE',
      payload: {...initalState, ...cachedState, cache_loaded: true},
    });
  }, []);


  return (
    <SavedResultsStore.Provider value={[state, dispatch]}>
      {children}
    </SavedResultsStore.Provider>
  );
};
