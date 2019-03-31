import React, {useState, useContext, useReducer} from 'react';

const initalState = {
  streets: [],
  beds:[],
  trees:[]
}

const reducer = (state, action) => {
    const {type,payload} = action
    switch(type){
        case "ADD_RESULT":
            debugger
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

  return (
    <SavedResultsStore.Provider value={[state, dispatch]}>
      {children}
    </SavedResultsStore.Provider>
  );
};
