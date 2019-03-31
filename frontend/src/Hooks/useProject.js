import React, {useContext, useState, useEffect} from 'react';

import {DataEntryStore} from '../Contexts/DataEntryContext';

export default (projectId, options = {}) => {
  const {refreshRate} = options;

  const [state, dispatch] = useContext(DataEntryStore);
  const {projects} = state;

  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestUpdateFormServer = async () => {
    console.log('requesting update form server');
    setLoading(true);
    let projectResponse = await fetch(`/api/projects/${projectId}`);
    setLoading(false);
    if (projectResponse.ok) {
      projectResponse = await projectResponse.json();
      dispatch({
        type: 'ADD_OR_UPDATE_PROJECT',
        payload: projectResponse,
      });
      setProject(projectResponse);
    } else {
      setError(new Error(projectResponse.statusText));
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
    let p = projects.find(p => `${p.id}` === projectId);
    let error = null;

    if (!p) {
      p = projects.find(p => p.slug === projectId);
    }
    if (p) {
      console.log('SETTING PROJECT AS ', p);
      setProject(p);
    } else {
      requestUpdateFormServer();
    }
  }, [projectId, projects]);

  return {project, error, loading};
};
