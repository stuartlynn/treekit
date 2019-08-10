import React, {useContext, useEffect} from 'react';
import {Link} from '@reach/router';
import {DataEntryStore} from '../Contexts/DataEntryContext';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

export default function Projects(props) {
  const [state, dispatch] = useContext(DataEntryStore);
  const {projects} = state;
  console.log('state is ', state);
  useEffect(() => {
    (async () => {
      const projects = await fetch('/api/projects').then(r => r.json());
      dispatch({
        type: 'UPDATE_PROJECTS',
        payload: projects,
      });
    })();
  }, []);

  return (
    <div className="page">
      <h1>Projects</h1>

      <div className='projectList'>
          {projects.map((p)=>
            <div className='projectDetails' style={{backgroundImage: `url("${p.img}")`}}>
                <div className='info'>
                    <Link to={`/projects/${p.slug}`}>
                        <h3>{p.name}</h3>
                    </Link>
              </div>
            </div>
          )}
      </div>
   
      {/*<GridList cellHeight={180}>
        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
          <ListSubheader component="div">Projects</ListSubheader>
        </GridListTile>
        {projects.map(p => (
          <Link key={p.id} to={`/projects/${p.slug}`}>
            <GridListTile >
              <img src={p.img} alt={p.name} />
              <GridListTileBar title={p.name} />
            </GridListTile>
          </Link>
        ))}
      </GridList> */}
    </div>
  );
}
