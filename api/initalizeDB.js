import connect from './db';

const initalizeDB = async ()=>{

    const [models,db] = await connect() 

    await db.sync({force: true});

    await models.Project.create({
    name: 'New York',
    description: 'New Yorks tree census',
    img:
      'https://www.nationalgeographic.com/content/dam/travel/Guide-Pages/north-america/united-states/newyork/newyork_NationalGeographic_2328428.adapt.1900.1.jpg',
    region: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.04510498046875, 40.68220016936447],
          [-73.88717651367188, 40.68220016936447],
          [-73.88717651367188, 40.81380923056958],
          [-74.04510498046875, 40.81380923056958],
          [-74.04510498046875, 40.68220016936447],
        ],
      ],
      crs: {type: 'name', properties: {name: 'EPSG:4326'}},
    },
    });

    await db.query(
    `insert into neighborhoods (name,geom,"createdAt","updatedAt","projectId") ( select  name as name,ST_TRANSFORM(wkb_geometry, 4326) as region, now() as createdAt, now() as updatedAd, 1 as projectId from new_york_neighborhoods);`,
    );

    await db.query(`INSERT INTO 
    streets (name,length,osm_id,"isEmpty",state,geom, "createdAt", "updatedAt", "projectId", "neighborhoodId")(
      SELECT nta_name as name, 
            ST_LENGTH(wkb_geometry::GEOGRAPHY) as length, 
            block_id as osm_id, 
            false, 
            'TODO', 
            wkb_geometry as geom, 
            now() as createdAt, 
            now() as updatedAt, 
            1 as projectId, 
            (
                SELECT neighborhoods.id  as id
                FROM neighborhoods,streets
                WHERE ST_Contains(neighborhoods.geom, ST_CENTROID(streets.geom))
                limit 1 
                ) as neighborhoodId 
      FROM new_york_blocks 
      WHERE ST_GeometryType(wkb_geometry) = 'ST_LineString');`);
      
    await db.query(`
    UPDATE streets SET  "neighborhoodId"  = neighborhoods.id  
    FROM neighborhoods
    WHERE ST_Contains(neighborhoods.geom, ST_CENTROID(streets.geom))
    `)
}

initalizeDB()
