import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {DataEntryProvider} from './Contexts/DataEntryContext';
import {SavedResultsProvider} from './Contexts/SavedResultsContext';

ReactDOM.render(
  <DataEntryProvider>
      <SavedResultsProvider>
        <App />
      </SavedResultsProvider>
  </DataEntryProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

window.addEventListener('load', () => {
    console.log("loaded Tile Worker")
    navigator.serviceWorker.register('TileWorker.js');
})
