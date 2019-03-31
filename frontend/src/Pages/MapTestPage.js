import React, {useRef, useState} from 'react';
import useMap from '../Hooks/useMap';
import useOSMLayer from '../Hooks/useOSMLayer';
import useMVTLayer from '../Hooks/useMVTLayer';
import {Style, Icon, Fill, Stroke, Circle, Text} from 'ol/style';

export default function MapTestPage(props) {
  const mapDiv = useRef(null);
  const {map} = useMap(
    mapDiv,
    {center: [-74.005974, 40.712776], zoom: 13},
    {interaction: true},
  );
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(500);

  useOSMLayer(map);
  useMVTLayer(
    map,
    'neighborhoods',
    'select * from neighborhoods',
    (feature, res) => {
      return new Style({
        fill: new Fill({
          color:
            feature.getProperties().id === selectedFeature
              ? 'rgba(0,255,0,1)'
              : 'rgba(127,48,242,0.6)',
        }),
        stroke: new Stroke({
          color: 'rgba(0,255,255,0.7)',
          width: 3,
        }),
      });
    },
    selectedFeature,
    10,
    true,
    {
      onCenterFeature: feature => {
        if (feature[0]) {
          setSelectedFeature(feature[0].id);
        }
      },
      onClickFeature: feature => {
        if (feature[0]) {
          setSelectedFeature(feature[0].id);
        }
      },
    },
  );

  useMVTLayer(
    map,
    'streets',
    `select * from streets where "neighborhoodId" = ${selectedFeature}`,
    (feature, res) =>
      new Style({
        stroke: new Stroke({
          color: 'rgba(0,0,255,0.8)',
          width: 1,
        }),
      }),
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
    </div>
  );
}
