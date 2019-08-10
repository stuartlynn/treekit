import React, {useContext, useEffect} from 'react';
import {DataEntryStore} from '../Contexts/DataEntryContext';
import useProject from '../Hooks/useProject';
import useProjectNeighborhoods from '../Hooks/useProjectNeighborhoods'
import {Link} from '@reach/router';

export default function Project(props) {
  const [state, dispatch] = useContext(DataEntryStore);
  const {project, err,loading} = useProject(props.id, {refreshRate:10000});
  const {neighborhoods,error,neighborhoodsLoading} = useProjectNeighborhoods(project ? project.id : null)

  console.log('neighborhoods: ',neighborhoods)
  return (
    <div className="page">
      {project && 
		<React.Fragment>
			<h1>{project.name}</h1>
            {neighborhoods && neighborhoods.sort((a,b)=>(a.name< b.name) ? -1 : (a.name > b.name) ? 1 : 0 ).map(nh=>(
				<Link to={`/neighbordhood/${nh.id}`}>
					<p key={nh.name} >{nh.name}</p>	
				</Link>
			))}
		</React.Fragment>
      }
    </div>
  );
}
