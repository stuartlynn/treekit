#!/bin/bash

echo "importing NY blocks"
docker run -it --rm -v $(pwd)/data:/data --network treekitnewprototype_treekit data_import -f "PostgreSQL" PG:"dbname=docker user=docker host=database password=docker" -lco OVERWRITE=yes -nln new_york_blocks  /data/2015\ Street\ Tree\ Census\ -\ Blockface\ Data.geojson

echo "importing NY Neighborhoods"
docker run -it --rm -v $(pwd)/data:/data --network treekitnewprototype_treekit data_import -f "PostgreSQL" PG:"dbname=docker user=docker host=database password=docker" -lco OVERWRITE=yes -nlt PROMOTE_TO_MULTI -nln new_york_neighborhoods /data/zillow/ZillowNeighborhoods-NY.shp

echo "Making derived tables"

PGPASSWORD=docker psql -h database -U docker -d docker -c "insert into neighborhoods (id,name,region,\"createdAt\",\"updatedAt\",\"projectId\") ( select  regionid::INTEGER as id, name as name,ST_TRANSFORM(wkb_geometry, 4326) as region, now() as createdAt, now() as updatedAd, 1 as projectId from new_york_neighborhoods);"
