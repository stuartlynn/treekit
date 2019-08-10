import React, {useState,useContext} from 'react'
import {SavedResultsStore} from '../Contexts/SavedResultsContext';


export default function YourTrees(){

  const [savedResults, savedResultsDispatch] = useContext(SavedResultsStore);
  const {trees, streets,beds} = savedResults


  return (
    <div>
        <div className="summary">
            You have contributed {trees.length} trees,
            in {beds.length} beds, on {streets.length} streets
        </div>

        <div className='trees'>
          {trees.map(tree=>
             <div className='tree'>
                 <p>Species:{tree.species.CommonName} </p>
                 <p>Health: {tree.health}</p>
                 <p>Street: {tree.street}</p>
                 <img src={tree.selfie} />
             </div>
          )}
        </div>

    </div> 
  )

}
