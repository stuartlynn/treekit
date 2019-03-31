import React, {useRef, useEffect, useState} from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Style} from 'ol/style';
import {unByKey} from 'ol/Observable';
import GeoJSON from 'ol/format/GeoJSON.js';
import Feature from 'ol/Feature.js';

export default function useGeoJSONLayer(
  map,
  name,
  features,
  style,
  selected,
  zIndex,
  visible,
  events = {},
) {
  const layer = useRef(null);
  const {onCenterFeature, onClickFeature} = events;

  const geojson = new GeoJSON({
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
  });

  /* Convert the origional features in to OL features */
  const processFeatures = (rawFeatures)=>{
      return rawFeatures.map(
        f =>
          new Feature({
            geometry: geojson.readGeometry(f.geom),
            ...f,
          }),
      );
  }

  /* Inital Setup */
  useEffect(() => {
    console.log('faetures are ', features);
    if (map.current) {
      layer.current = new VectorLayer({
        source: new VectorSource({
          features: processFeatures(features),
        }),
        visible: visible,
        style,
      });
      layer.current.setZIndex(zIndex);
      map.current.addLayer(layer.current);
    }
    return () => {
      map.current.removeLayer(layer.current);
    };
  }, []);

  /* Update features */
  useEffect(() => {
    if (features) {
      layer.current.getSource().clear();
      layer.current.getSource().addFeatures(processFeatures(features));
    }
  }, [features]);

  /* Refresh the layer when selected changes */
  useEffect(() => {
    if (selected) {
      layer.current.setStyle(style);
    }
  }, [selected, style]);

  /* Update when visible changes */
  useEffect(() => {
    layer.current.setVisible(visible);
  }, [visible]);


  /*Set up moitoring for central feature*/
  useEffect(() => {
    if (map.current && onCenterFeature) {
      const handler = map.current.on('moveend', point => {
        const p = map.current.getView().getCenter();

        const feature = layer.current.getSource().getClosestFeatureToCoordinate(p);
        if (feature) {
          onCenterFeature(feature.getProperties());
        }
      });
      return () => {
        unByKey(handler);
      };
    }
  }, [onCenterFeature]);

  /*Set up monitoring for click events*/
  useEffect(() => {
    if (map.current && onClickFeature) {
      const handler = map.current.on(
        'click',
        event => {
          console.log('clicking ', event.pixel);
          const features = map.current.getFeaturesAtPixel(event.pixel);
          if (features) {
            onClickFeature(features.map(f => f.getProperties()));
          }
          return () => {
            unByKey(handler);
          };
        },
        {hitTolerance: 0.01},
      );
    }
  }, []);
}
