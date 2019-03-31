import React, {useRef, useEffect, useState} from 'react';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import {Style, Icon, Fill, Stroke, Circle, Text} from 'ol/style';
import {unByKey} from 'ol/Observable';
import MVT from 'ol/format/MVT.js';

export default function useMVTLayer(
  map,
  name,
  query,
  style,
  selected,
  zIndex,
  visible,
  events = {},
) {
  const layer = useRef(null);
  const {onCenterFeature, onClickFeature} = events;
  useEffect(() => {
    console.log('UPDATING LAYER ', name);
    if (map.current) {
      layer.current = new VectorTileLayer({
        source: new VectorTileSource({
          url: `/tiler/tiles/{z}/{x}/{y}.mvt?q=${query}`,
          format: new MVT(),
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
  }, [query]);

  useEffect(() => {
    if (selected) {
      console.log('updating style for ', name);
      layer.current.setStyle(style);
    }
  }, [selected, style]);

  useEffect(()=>{
	layer.current.setVisible(visible)
  },[visible])

  useEffect(() => {
    if (map.current && onCenterFeature) {
      const handler = map.current.on('moveend', point => {
        const p = map.current.getView().getCenter();
        const pix = map.current.getPixelFromCoordinate(p);

        const features = map.current.getFeaturesAtPixel(pix, l => true);
        if (features) {
          onCenterFeature(features.map(f => f.getProperties()));
        }
      });
      return () => {
        unByKey(handler);
      };
    }
  }, []);

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
