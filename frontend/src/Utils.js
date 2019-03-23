import * as turf from '@turf/turf'
import GeoJSON from 'ol/format/GeoJSON.js';

export const getGeoJSON = async query => {
  const baseURL = 'http://localhost:8886/query';
  const limit_query = `select * from (${query}) as s limit 1 `;
  const firstRowResponse = await fetch(`${baseURL}?q=${query}`);
  const firstRow = await firstRowResponse.json();
  const excludeColumns = ['geom'];
  const columns = firstRow.fields.map(f=>f.name).filter(
    k => !excludeColumns.includes(k),
  );

  const fullQuery = `
    SELECT row_to_json(fc) as geojson
    FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f.json_build_object)) As features
    FROM(
     SELECT json_build_object(
    'type',       'Feature',
    'id',         id,
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


export const checkNearLine = (point,features, tollerence= 0.02)=>{
    const nonBrokenLines = features.filter((f)=>f.geometry.type === 'LineString')
    const streetDistances = nonBrokenLines.map((line)=> turf.pointToLineDistance(turf.point(point), line, {units:'meters'}))
    const minIndex = streetDistances.indexOf(Math.min(...streetDistances))
    return nonBrokenLines[minIndex]
    //console.log('overlaps ' ,overLapingStreets)
}


export const constructBedGeometry = ( bedDetails, street )=>{
    const geojson =  new GeoJSON()
    const {direction,side} = street.direction

    const streetGeoJSON = geojson.writeFeature(street.feature)

}
