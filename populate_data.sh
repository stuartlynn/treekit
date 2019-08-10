#!/bin/bash

echo "importing NY blocks"
docker run -it --rm -v $(pwd)/data:/data --network treekit_treekit --entrypoint=ogr2ogr stuartlynn/ogr2ogr -f "PostgreSQL" PG:"dbname=docker user=docker host=database password=docker" -lco OVERWRITE=yes -nln new_york_blocks  /data/2015\ Street\ Tree\ Census\ -\ Blockface\ Data.geojson

echo "importing NY Neighborhoods"
docker run -it --rm -v $(pwd)/data:/data --network treekit_treekit --entrypoint=ogr2ogr stuartlynn/ogr2ogr -f "PostgreSQL" PG:"dbname=docker user=docker host=database password=docker" -lco OVERWRITE=yes -nlt PROMOTE_TO_MULTI -nln new_york_neighborhoods /data/zillow/ZillowNeighborhoods-NY.shp


echo "Setting up db tables"
docker-compose run api babel-node initalizeDB.js
