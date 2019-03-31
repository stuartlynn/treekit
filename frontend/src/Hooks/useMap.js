import React, {useRef, useState, useContext, useEffect} from 'react';
import {Map, View} from 'ol';
import * as Interaction from 'ol/interaction';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import 'ol/ol.css';

const geojson = new GeoJSON({
  featureProjection: 'EPSG:3857',
  dataProjection: 'EPSG:4326',
});

export default function useMap(mapDiv, location, options = {}, zoomToExtent) {
  const interaction = Object.keys(options).includes('interaction')
    ? options.interaction
    : true;

  console.log('location is ', location);
  const [ready, setReady] = useState(false);
  const map = useRef(null);
  const view = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      setReady(false);
      view.current = new View({
        center: fromLonLat(location.center),
        zoom: location.zoom,
      });
      const interactions = interaction
        ? Interaction.defaults()
        : Interaction.defaults({
            doubleClickZoom: false,
            dragAndDrop: false,
            dragPan: false,
            keyboardPan: false,
            keyboardZoom: false,
            mouseWheelZoom: false,
            pointer: false,
            select: false,
          });
      map.current = new Map({
        target: mapDiv.current,
        view: view.current,
        interactions,
      });

      setTimeout(() => map.current.updateSize(), 100);
      window.addEventListener('resize', () => {
        setTimeout(() => map.current.updateSize(), 100);
      });
      setTimeout(() => map.current.updateSize(), 100);
    }
  }, []);

  useEffect(() => {
    if (zoomToExtent && map.current) {
      const feature = geojson.readFeature(zoomToExtent.geom);
      map.current
        .getView()
        .fit(feature.getGeometry(), {duration: 5, padding: [0, 0, 100, 0, 0]});
    }
  }, [zoomToExtent]);
  //useEffect(() => {
  //if (interaction) {
  //Interaction.defaults().forEach(inter => {
  //map.current.addInteraction(inter);
  //});
  //} else {
  //console.log('removing interactions');
  //Interaction.defaults().forEach(inter => {
  //map.current.removeInteraction(inter);
  //});
  //}
  //}, [interaction]);
  //const flyTo = location => {};

  return {map};
}
