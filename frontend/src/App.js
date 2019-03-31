import React, {Component} from 'react';
import logo from './logo.svg';
import {Router} from '@reach/router';
import ManualEntry from './Pages/ManualEntry'
import MapEntry from './Pages/MapEntry'
import MapTestPage from './Pages/MapTestPage'
import Projects from './Pages/Projects'
import NeighborhoodPage from './Pages/Neighborhood'
import Project from './Pages/Project'
import SpeciesPickerPage from './Pages/SpeciesPickerPage'
import SelfiePage from './Pages/SelfiePage'
import ContributePage from './Pages/Contribute'
import Home from './Pages/Home'

import './App.css';

export default function App(props) {
  return (
    <div className="App">
      <Router style={{width:'100%',height:'100%'}}>
          <Home path='/' />
          <MapEntry path ='/map_entry' />
          <Projects path ='/projects' />
          <Project path ='/projects/:id' />
          <ManualEntry path='/manual_entry' />
          <SpeciesPickerPage path='/species_picker' />
          <SelfiePage path='/selfie' />
          <NeighborhoodPage path='/neighbordhood/:id' />
          <ContributePage path='/neighbordhood/:id/contribute' />
          <MapTestPage path='/maptest' />
      </Router>
    </div>
  );
}
