import React, {useContext, useState, useEffect} from 'react';
import {DataEntryStore} from '../Contexts/DataEntryContext';

export default (neighborhoodId, options = {}) => {
  const {refreshRate} = options;

  const [state, dispatch] = useContext(DataEntryStore);
  const localStreets = state.streets;

  const [streets, setStreets] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestUpdateFromServer = async () => {
    console.log('requesting update form server');
    setLoading(true);
    let streetResponse = await fetch(`/api/streets?neighborhoodId=${neighborhoodId}`);
    setLoading(false);
    if (streetResponse.ok) {
      streetResponse = await streetResponse.json();
      dispatch({
        type: 'ADD_OR_UPDATE_STREETS_FOR_NEIGHBORHOOD',
        payload: streetResponse,
      });
      setStreets(streetResponse);
    } else {
      setError(new Error(streetResponse.statusText));
    }
  };

  useEffect(() => {
    if (refreshRate) {
      console.log('setting up timer');
      let timer = setInterval(requestUpdateFromServer, refreshRate);
      return () => {
        clearInterval(timer);
      };
    }
  }, [refreshRate]);

  useEffect(() => {
    let s = localStreets.find(s => `${s.neighborhoodId}` === neighborhoodId);
    let error = null;
    if (s) {
      setStreets(s);
    } else {
      requestUpdateFromServer();
    }
  }, [neighborhoodId, localStreets]);

  return {streets, error, loading};
};
