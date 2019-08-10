import React, {useContext, useEffect} from 'react';
import {Link} from '@reach/router';

export default function Home(props) {
  return (
    <div className="page">
      <img src="http://treekit.org/wp-content/uploads/2011/06/110610_TreeKIT_logo_long2.jpg" />
      <div className="homePage">
        <p>
          TreeKIT builds tools to help city dwellers measure, map, and
          collaboratively manage urban ecosystems. The project is focused on
          high density urban areas where the links between human and non-human
          health are most clearly evident. Mapping street trees introduces
          people to the neighborly “charasmatic megaflora” (AKA trees) living on
          their city block and quietly contributing many ecosystem services and
          raising property values. Through TreeKIT’s educational mapping
          workshops, we aim to promote long term stewardship of the urban
          forest, one tree at a time.
        </p>
        <Link to="/projects">
          <button>Get Started!</button>
        </Link>
        <Link to="/your_trees">
          <button>Your Trees!</button>
        </Link>
      </div>
      {/*
            <Link to='/map_entry'><button>Enter Using Map</button></Link>
            <Link to='/manual_entry'><button>Enter Using Measurements</button></Link>
            <Link to='/species_selector'><button>Species Selector</button></Link>
            */}
    </div>
  );
}
