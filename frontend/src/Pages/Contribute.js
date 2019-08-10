import React, {useRef, useContext} from 'react';
import useMap from '../Hooks/useMap';
import useOSMLayer from '../Hooks/useOSMLayer';
import useNeighborhood from '../Hooks/useNeighborhood';
import useNeighborhoodStreets from '../Hooks/useNeighborhoodStreets';
import useGeoJSONLayer from '../Hooks/useGeoJSONLayer';
import {NeighborhoodStyleSimple, StreetStyle, CurrentBedStyle, BedStyle} from '../MapStyles';
import FindLocationIcon from '@material-ui/icons/LocationSearching';
import TargetIcon from '@material-ui/icons/MyLocation';
import DetailsFlow from '../Componets/DetailsFlow';
import {DataEntryStore} from '../Contexts/DataEntryContext';
import {useCurrentPosition} from 'react-use-geolocation';
import {constructBedGeometry} from '../Utils'


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

export default function Contribute(props) {
  const mapDiv = useRef(null);
  const neighborhoodId = props.id;
  const [state, dispatch] = useContext(DataEntryStore);

  const {neighborhood} = useNeighborhood(neighborhoodId);
  const {streets} = useNeighborhoodStreets(neighborhoodId);

  const [gpsPosition, error] = useCurrentPosition();
  const {street,focusOn, stage, currentStreetBed, streetBeds } = state;
  const {showBlocks,showCurrentBed} = state.map;
  const zoomToFeature  = (()=>{
	switch(focusOn){
		case "street":
			return street	
		case 'neighborhood':
			return neighborhood
		default:
			return null	
	}
  })()

  console.log('StAGE IS ',stage)
  const onSelectCentralFeature = (feature)=>{
        if (feature) {
          dispatch({
            type: 'UPDATE_STREET',
            payload: feature,
          });
        }
  }

  const {map} = useMap(
    mapDiv,
    {
      center: [-74.005974, 40.712776],
      zoom: 13,
    },
    {},
    zoomToFeature,
  );

  useOSMLayer(map);
 
  useGeoJSONLayer(
    map,
    'neighborhood',
    neighborhood ? [neighborhood] : [],
    NeighborhoodStyleSimple,
    null,
    21,
    true,
  );

  useGeoJSONLayer(
    map,
    'streets',
    streets ? streets : [],
    StreetStyle({
       selectedId: street.id ,
       onlySelected: !showBlocks,
       showArrow: stage == 'SelectStreetDetails',
       arrowDirection: street.direction 
    }),
    street,
    20,
    true,
    {
      onCenterFeature: stage=='SelectStreet' ? onSelectCentralFeature : null 
    },
  );

  useGeoJSONLayer(
    map,
    'street_beds',
    streetBeds ? streetBeds.map((bed)=>constructBedGeometry(bed,street)): [],
    BedStyle,
    null,
    22,
    true,
    {}
  )
 


  useGeoJSONLayer(
    map,
    'current_street_bed',
    showCurrentBed ? [constructBedGeometry(currentStreetBed, street )] : [],
    CurrentBedStyle,
    null,
    22,
    true,
    {}
  )

  const centerMapOnGPS = () => {};

  return (
    <div className="page">
      <div
        ref={el => (mapDiv.current = el)}
        style={{width: '100%', height: '100%'}}
      />
      <FindLocationIcon
        style={{
          backgroundColor: 'rgba(0, 60, 136, 0.3)',
          color: 'white',
          position: 'absolute',
          top: '10px',
          left: '10px',
          boxSizing: 'border-box',
          padding: '5px',
        }}
        onClick={centerMapOnGPS}
      />
      <TargetIcon
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          fontSize: 40,
          color: 'rgb(153, 202, 62)',
          transform: 'translate3D(-50%,-50%,0)',
        }}
      />
      <div className="features" style={featureStyle}>
        <DetailsFlow
          stage={state.stage}
          data={state}
          dispatch={dispatch}
          onDone={result => {
            //savedResultsDispatch({
            //type: 'ADD_RESULT',
            //payload: result
            //})
          }}
        />
      </div>
    </div>
  );
}
