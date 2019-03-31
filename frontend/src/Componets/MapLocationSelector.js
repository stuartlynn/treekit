import 'ol/ol.css';
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {useCurrentPosition} from 'react-use-geolocation';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import {Style, Icon, Fill, Stroke, Circle, Text} from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat, toLonLat} from 'ol/proj';
import {MVT, WKT} from 'ol/format';
import {Map, View, Observable} from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON.js';
import FindLocationIcon from '@material-ui/icons/LocationSearching';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {
  getGeoJSON,
  constructBedGeometry,
  deSerializeGeom,
  serializeGeom,
} from '../Utils';
import TargetIcon from '@material-ui/icons/MyLocation';

export default function MapContainer(props) {
  const mapDiv = useRef(null);
  const map = useRef(null);
  //const treeLayer = useRef(null);
  const gpsLayer = useRef(null);
  const blocksLayer = useRef(null);
  const selectedStreetLayer = useRef(null);
  const activeStreetLayer = useRef(null);
  const directionLayer = useRef(null);
  const activeBedLayer = useRef(null);
  const completedLayer = useRef(null);
  const bedLayer = useRef(null);

  const [blockFeatures, setBlockFeatures] = useState(null);

  const [gpsPosition, error] = useCurrentPosition();

  const {
    position,
    gps,
    selectedStreet,
    selectStreetActive,
    street,
    zoomToExtent,
    interaction,
    showBlocks,
    currentStreetBed,
    streetBeds,
    completedStreets,
  } = props;

  // HACK FIX THIS
  const selectStreetActiveRef = useRef(selectStreetActive);
  useEffect(() => {
    selectStreetActiveRef.current = selectStreetActive;
  }, [selectStreetActive]);

  const centerMapOnGPS = () => {
    const coords = gps;
    map.current.getView().animate({
      center: fromLonLat([coords[0], coords[1]]),
    });
  };

  const selectNearestStreet = point => {
    if (
      selectedStreetLayer.current &&
      blocksLayer.current &&
      selectStreetActiveRef.current
    ) {
      const feature = blocksLayer.current
        .getSource()
        .getClosestFeatureToCoordinate(point);
      if (feature) {
        const properties = feature.getProperties();
        const street = {
          id: properties.id,
          length: properties.linelength,
          extent: feature.getGeometry().getExtent(),
          geom: serializeGeom(feature),
        };

        //debugger
        props.onStreetSelected(street);
      }
    }
  };

  useEffect(() => {
    if (selectedStreetLayer.current) {
      selectedStreetLayer.current.getSource().clear();
      if (selectedStreet) {
        selectedStreetLayer.current
          .getSource()
          .addFeature(deSerializeGeom(selectedStreet.geom));
      }
    }
  }, [selectedStreet]);

  useEffect(() => {
    if (blocksLayer.current) {
      blocksLayer.current.setVisible(showBlocks);
    }
  }, [showBlocks]);

  useEffect(() => {
    if (activeBedLayer.current && currentStreetBed && currentStreetBed.geom) {
      const bedFeature = deSerializeGeom(currentStreetBed.geom);
      activeBedLayer.current.getSource().clear();
      activeBedLayer.current.getSource().addFeature(bedFeature);
    }
  }, [currentStreetBed]);

  useEffect(() => {
    if (completedLayer.current) {
      completedLayer.current.getSource().clear();
      completedLayer.current
        .getSource()
        .addFeatures(
          completedStreets.map(street => deSerializeGeom(street.geom)),
        );
    }
  }, [completedStreets]);

  useEffect(() => {
    selectedStreetLayer.current = new VectorLayer({
      name: 'selectedStreet',
      visible: 'true',
      source: new VectorSource({wrapX: false}),
      style: new Style({
        stroke: new Stroke({
          color: 'orange',
          width: 5,
        }),
      }),
    });

    if (selectedStreet) {
      selectedStreetLayer.current
        .getSource()
        .addFeature(deSerializeGeom(selectedStreet.geom));
    }

    blocksLayer.current = new VectorLayer({
      source: new VectorSource({}),
      visibile: showBlocks,
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 5,
        }),
      }),
    });

    completedLayer.current = new VectorLayer({
      source: new VectorSource({
        features: completedStreets.map(s => deSerializeGeom(s.geom)),
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'yellow',
          width: 5,
        }),
      }),
    });

    activeBedLayer.current = new VectorLayer({
      source: new VectorSource({}),
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(1,0,0,0.6)',
        }),
      }),
    });

    bedLayer.current = new VectorLayer({
      source: new VectorSource({}),
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0,0,1,0.6)',
        }),
      }),
    });

    if (currentStreetBed && street && street.feature) {
      console.log(currentStreetBed, street);
      selectedStreetLayer.current
        .getSource()
        .addFeature(constructBedGeometry(currentStreetBed, street));
    }

    gpsLayer.current = new VectorLayer({
      name: 'gps',
      visible: 'true',
      source: new VectorSource({wrapX: false}),
      style: new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({color: '#99CA3E'}),
        }),
      }),
    });

    activeStreetLayer.current = new VectorLayer({
      name: 'activeStreet',
      visible: 'true',
      source: new VectorSource({wrapX: false}),
      style: feature => {
        const coords = feature.getGeometry().getCoordinates();
        const dx = coords[0][0] - coords[1][0];
        const dy = coords[0][1] - coords[1][1];

        const midX = (coords[0][0] + coords[1][0]) / 2;
        const midY = (coords[0][1] + coords[1][1]) / 2;

        const rotation = Math.atan2(dy, dx);
        const {direction, side} = feature.getProperties();

        return [
          new Style({
            stroke: new Stroke({
              color: 'green',
              width: 5,
            }),
          }),
          new Style({
            geometry: new Point([midX, midY]),
            image: new Icon({
              src: 'https://openlayers.org/en/latest/examples/data/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation:
                direction === 'Backward' ? -rotation : Math.PI - rotation,
            }),
          }),
        ];
      },
    });

    directionLayer.current = new VectorLayer({
      name: 'direction',
      visible: 'true',
      source: new VectorSource({wrapX: false}),
    });

    map.current = new Map({
      target: mapDiv.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        gpsLayer.current,
        blocksLayer.current,
        selectedStreetLayer.current,
        activeStreetLayer.current,
        activeBedLayer.current,
        bedLayer.current,
        directionLayer.current,
        completedLayer.current
      ],
      view: new View({
        center: fromLonLat(props.initalPosition),
        zoom: 15.431331038887276,
      }),
      controls: [new ScaleLine()],
    });

    map.current.on('moveend', () => {
      const centroidMercator = map.current.getView().getCenter();
      const centroid = toLonLat(centroidMercator);

      props.onPositionChanged({
        coords: {longitude: centroid[0], latitude: centroid[1]},
      });
      selectNearestStreet(centroidMercator);
    });
    setTimeout(() => map.current.updateSize(), 200);
  }, []);

  useEffect(() => {
    const features = streetBeds.map(bed => deSerializeGeom(bed.geom));
    bedLayer.current.getSource().clear();
    bedLayer.current.getSource().addFeatures(features);
  }, [streetBeds, street]);

  useEffect(() => {
    if (gpsPosition) {
      const coords = gpsPosition.coords;
      props.onGPSUpdated([coords.longitude, coords.latitude]);
    }
  }, [gpsPosition]);

  useEffect(() => {
    if (zoomToExtent && map.current) {
      map.current
        .getView()
        .fit(zoomToExtent, {duration: 5, padding: [0, 0, 100, 0, 0]});
    }
  }, [zoomToExtent]);

  useEffect(() => {
    blocksLayer.current.getSource().clear();
    if (blockFeatures && map.current) {
      const featureSet = new GeoJSON().readFeatures(blockFeatures, {
        featureProjection: 'EPSG:3857',
      });
      blocksLayer.current.getSource().addFeatures(featureSet);
    }
  }, [blockFeatures, map.current]);

  useEffect(() => {
    activeStreetLayer.current.getSource().clear();
    if (street.geom) {
      const activeStreet = new Feature({
        geometry: deSerializeGeom(street.geom).getGeometry(),
        ...street,
      });

      activeStreetLayer.current.getSource().addFeature(activeStreet);
    }
  }, [street]);

  useEffect(() => {
    getGeoJSON(`select wkb_geometry as geom, 
                 block_id as id,
                 nta_name, 
                 ST_LENGTH(wkb_geometry::GEOGRAPHY) as linelength
                 from new_york_blocks`).then(result => {
      console.log(result);
      setBlockFeatures(result);
    });
  }, []);

  return (
    <div id="MapContainer" style={{...props.style}}>
      <div
        style={{width: '100%', height: '100%'}}
        ref={el => (mapDiv.current = el)}
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
      {selectStreetActive && (
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
      )}
    </div>
  );
}
