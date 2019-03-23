import React, {Component} from 'react';
import logo from './logo.svg';
import {Router} from '@reach/router';
import ManualEntry from './Pages/ManualEntry'
import MapEntry from './Pages/MapEntry'
import SpeciesPickerPage from './Pages/SpeciesPickerPage'
import SelfiePage from './Pages/SelfiePage'
import Home from './Pages/Home'

import './App.css';

export default function App(props) {
  return (
    <div className="App">
      <Router style={{width:'100%',height:'100%'}}>
          <Home path='/' />
          <MapEntry path ='/map_entry' />
          <ManualEntry path='/manual_entry' />
          <SpeciesPickerPage path='/species_picker' />
          <SelfiePage path='/selfie' />
      </Router>
    </div>
  );
}
