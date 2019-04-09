# TreeKit 

This repo contains a working prototype of a new interface for TreeKit. It allows both online (on device), off-line (on device) and after the fact (on paper) data entry 
for tree census projects. 

It consists of 

1) A pogstgis database for storage of the relevant data and results 
2) A React based progressive web application that can be run with internet connection of through a service working without 
3) A tiler to be able to produce MVT's of the results 
4) An API to allow the server and the frontend to talk 

### Running the app

Clone this REPO 

```bash
git clone https://github.com/stuartlynn/treekit.git
cd treekit
```
Unzip the data folder so we have some data to play with 

```bash
tar xzvf data.tar.gz
```

The application is run using docker-compose with the command 

```bash
docker-compose up
```

This will spin up the application and you should be able to navigate to [http://localhost:3000](http://localhost:3000) to view it.

Once it's running, we need to import the data we need for testing. Do do this run 

```bash
./populate_data 
```

## Contributing 

To contribute to this project, take a look at the open tickets. The procedure for a pull request is to 

1) Fork the develop branch to one with the format feature/{feature_name}
2) Commit your work to that branch 
3) Make a pull request to develop 

## Deploying 

Currently the app is deployed on a digital ocean droplet at [142.93.120.83](http://142.93.120.83) .
Deployment is handled by circleci and is automatically triggered on updates 
to the master branch. 

*WARNING* Currently the deploy step will trash all data on the production server 
this is because we are not actively in production yet, we will resolve this 
issue before any kind of launch
