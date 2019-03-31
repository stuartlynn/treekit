import React, {useRef, useEffect, useState} from 'react';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';

export default function useOSMLayer(map) {
  const layer = useRef(null);
  useEffect(() => {
    layer.current = new TileLayer({
      source: new OSM(),
    });
    if (map.current) {
      map.current.addLayer(layer.current);
    }
  }, [map.current]);
}
