import * as turf from '@turf/turf';
import turfReverse from 'turf-reverse'
import {MVT, WKT} from 'ol/format';

import GeoJSON from 'ol/format/GeoJSON.js';

export const getGeoJSON = async query => {
  const baseURL = 'http://localhost/tiler/query';
  const limit_query = `select * from (${query}) as s limit 1 `;
  const firstRowResponse = await fetch(`${baseURL}?q=${limit_query}`);
  const firstRow = await firstRowResponse.json();
  const excludeColumns = ['geom'];
  const columns = firstRow.fields
    .map(f => f.name)
    .filter(k => !excludeColumns.includes(k));

  const fullQuery = `
    SELECT row_to_json(fc) as geojson
    FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f.json_build_object)) As features
    FROM(
     SELECT json_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(ST_LINEMERGE(geom))::json,
    'properties', json_build_object(
        ${columns.map(c => `'${c}', ${c}`).join(',')}
         )
     )
     FROM (${query}) as q  ) as f ) as fc;
    `;

  const resultJson = await fetch(`${baseURL}?q=${fullQuery}`);
  const result = await resultJson.json();
  return result.rows[0].geojson;
};

export const checkNearLine = (point, features, tollerence = 0.02) => {
  const nonBrokenLines = features.filter(f => f.geometry.type === 'LineString');
  const streetDistances = nonBrokenLines.map(line =>
    turf.pointToLineDistance(turf.point(point), line, {units: 'meters'}),
  );
  const minIndex = streetDistances.indexOf(Math.min(...streetDistances));
  return nonBrokenLines[minIndex];
  //console.log('overlaps ' ,overLapingStreets)
};

export const constructBedGeometry = (bedDetails, street) => {
  const geojson = new GeoJSON();
  const {direction, side} = street;
  const {width, depth, distance, absoluteStart,absoluteEnd} = bedDetails;
  const streetFeature =  street.geom // deSerializeGeom(street.geom)
    
  const proj = {
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326',
  };


  let linestring = street.geom // geojson.writeFeatureObject(streetFeature, proj);


  if(direction === 'Backward'){
    linestring = turfReverse({'type' : 'Feature', 'properties': {}, 
    'geometry' : street.geom}).geometry
  }

  const lineStartPoint = linestring.coordinates[1];
  const lineEndPoint = linestring.coordinates[0];

  const bedStartPointLine = turf.along(linestring, absoluteStart, {units: 'meters'});
  const bedEndPointLine = turf.along(linestring, absoluteEnd, {
    units: 'meters',
  });

 
  const bearing = turf.bearing(lineStartPoint, lineEndPoint);

  let bearingPerp = bearing + ( side ==='Left' ? 90 : -90) ;
  if (bearingPerp > 180){
    bearingPerp = bearingPerp - 360
  }
  if (bearingPerp < -180){
    bearingPerp = bearingPerp + 360
  }
    
  const perpStartPoint = turf.destination(bedStartPointLine, depth, bearingPerp, {
    units: 'meters',
  });
  const perpEndPoint = turf.destination(bedEndPointLine, depth, bearingPerp, {
    units: 'meters',
  });

  const resultGeoJSON = turf.polygon([
    [
      bedStartPointLine.geometry.coordinates,
      bedEndPointLine.geometry.coordinates,
      perpEndPoint.geometry.coordinates,
      perpStartPoint.geometry.coordinates,
      bedStartPointLine.geometry.coordinates,
    ],
  ]);

 // const feature = geojson.readFeature(resultGeoJSON, proj)
  return {resultGeoJSON, geom: resultGeoJSON.geometry};
};


export const serializeGeom = (geom)=>{
   return  new WKT().writeFeature(geom, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            })
}

export const deSerializeGeom = (geom)=>{
   return  new WKT().readFeature(geom, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            })
}
