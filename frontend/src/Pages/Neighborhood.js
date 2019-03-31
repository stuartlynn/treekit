import React, {useState, useContext, useRef} from 'react';
import useMap from '../Hooks/useMap';
import useOSMLayer from '../Hooks/useOSMLayer';
import useGeoJSONLayer from '../Hooks/useGeoJSONLayer';
import useNeighborhood from '../Hooks/useNeighborhood';
import useNeighborhoodStreets from '../Hooks/useNeighborhoodStreets';
import {Style, Fill, Stroke} from 'ol/style';
import * as turf from '@turf/turf';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {Link} from '@reach/router';
import {NeighborhoodStyle, StreetStyle} from '../MapStyles'

export default function Neighborhood(props) {
  const featureStyle = {
    zIndex: 10,
    width: '90%',
    margin: '0 5%',
    backgroundColor: '#99CA3E',
    overflowY: 'auto',
    position: 'absolute',
    bottom: '0px',
    maxHeight: '50%',
    boxShadow: '0px 0px 13px 3px rgba(0,0,0,0.75)',
    borderRadius: '10px 10px 0px 0px',
  };
  const {
    neighborhood,
    neighborhoodError,
    neighborhoodLoading,
  } = useNeighborhood(props.id);

  const {streets, streetsError, streetsLoading} = useNeighborhoodStreets(
    props.id,
  );

  const stats = streets
    ? streets.reduce(
        (counts, street) => ({
          ...counts,
          [street.state]: counts[street.state] + 1,
        }),
        {DONE: 0, TODO: 0, CHECKED_OUT: 0, SKIP: 0},
      )
    : null;

  console.log('STATS ARE ', stats);

  const mapDiv = useRef(null);
  const {map} = useMap(
    mapDiv,
    {
      center: [-74.005974, 40.712776],
      zoom: 13,
    },
    {
      interaction: false,
    },
    neighborhood,
  );

  useOSMLayer(map);

  useGeoJSONLayer(
    map,
    'neighborhood',
    neighborhood ? [neighborhood] : [],
	NeighborhoodStyle,
    null,
    20,
    true,
  );

  useGeoJSONLayer(
    map,
    'streets',
    streets ? streets : [],
   	StreetStyle(), 
    null,
    20,
    true,
  );

  return (
    <div className="page">
      <div
        ref={el => (mapDiv.current = el)}
        style={{width: '100%', height: '100%'}}
      />
      <div style={featureStyle}>
        {neighborhood ? (
          <React.Fragment>
            <h1>{neighborhood.name} </h1>

            <FormControlLabel
              control={
                <Switch checked={true} onChange={() => {}} value="checkedA" />
              }
              label="Make valiable offline"
            />

            {stats && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                }}>
                <div>Done: {stats['DONE']}</div>
                <div>Checked Out:{stats['CHECKED_OUT']} </div>
                <div>To do {stats['TODO']}</div>
              </div>
            )}
            <div>
              <Link to={`/neighbordhood/${props.id}/contribute`}>
                <Button variant="contained">Contribute</Button>
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <h1>Could not find neighborhood</h1>
        )}
      </div>
    </div>
  );
}
