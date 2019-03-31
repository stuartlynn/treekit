import React, {useContext, useState, useEffect} from 'react';

import {DataEntryStore} from '../Contexts/DataEntryContext';

export default (projectId, options = {}) => {
  const {refreshRate} = options;

  const [state, dispatch] = useContext(DataEntryStore);
  const localNeighborhoods = state.neighborhoods;

  const [neighborhoods, setNeighbordhoods] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestUpdateFormServer = async () => {
    console.log('requesting update form server');
    setLoading(true);
    let neighborhoodResponse = await fetch(`/api/neighborhoods?projectId=${projectId}&limit=10000`);
    setLoading(false);
    if (neighborhoodResponse.ok) {
      neighborhoodResponse = await neighborhoodResponse.json();
      dispatch({
        type: 'UPDATE_NEIGHBORHOODS_FOR_PROJECT',
        payload: neighborhoodResponse,
      });
      setNeighbordhoods(neighborhoodResponse);
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
	if(projectId){
		let nh = localNeighborhoods.filter(n => n.projectId === projectId);
		let error = null;

		setNeighbordhoods(nh);
		requestUpdateFormServer();
	}
  }, [projectId ]);

  return {neighborhoods, error, loading};
};
