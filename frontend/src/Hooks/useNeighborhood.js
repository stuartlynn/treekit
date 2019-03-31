import React, {useContext, useState, useEffect} from 'react';

import {DataEntryStore} from '../Contexts/DataEntryContext';

export default (neighborhoodId, options = {}) => {
  const {refreshRate} = options;

  const [state, dispatch] = useContext(DataEntryStore);
  const localNeighborhoods = state.neighborhoods;
  const {offlineNeighborhoods} = state

  const [neighborhood, setNeighborhood] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestUpdateFormServer = async () => {
    console.log('requesting update form server');
    setLoading(true);
    let neighborhoodResponse = await fetch(`/api/neighborhoods/${neighborhoodId}`);
    setLoading(false);
    if (neighborhoodResponse.ok) {
      neighborhoodResponse = await neighborhoodResponse.json();
      dispatch({
        type: 'ADD_OR_UPDATE_NEIGHBORHOOD',
        payload: neighborhoodResponse,
      });
      setNeighborhood(neighborhoodResponse);
    } else {
      setError(new Error(neighborhoodResponse.statusText));
    }
  };

  useEffect(() => {
    if (refreshRate) {
      console.log('setting up timer');
      let timer = setInterval(requestUpdateFormServer, refreshRate);
      return () => {
        clearInterval(timer);
      };
    }
  }, [refreshRate]);

  useEffect(() => {
    let p = localNeighborhoods.find(p => `${p.id}` === neighborhoodId);
    let error = null;

    if (!p) {
      p = localNeighborhoods.find(p => p.slug === neighborhoodId);
    }
    if (p) {
      console.log('SETTING neighborHood AS ', p);
      setNeighborhood(p);
    } else {
      requestUpdateFormServer();
    }
  }, [neighborhoodId, localNeighborhoods ]);

  return {neighborhood, error, loading};
};
