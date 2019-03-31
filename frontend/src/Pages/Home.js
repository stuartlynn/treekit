import React, {useContext,useEffect} from 'react'
import {Link} from '@reach/router';

export default function Home(props){
    return(
        <div className='page'>
            <img src='http://treekit.org/wp-content/uploads/2011/06/110610_TreeKIT_logo_long2.jpg' />
            <Link to='/projects'><button>Projects</button></Link>
            <Link to='/map_entry'><button>Enter Using Map</button></Link>
            <Link to='/manual_entry'><button>Enter Using Measurements</button></Link>
            <Link to='/species_selector'><button>Species Selector</button></Link>
        </div>
    )
}
