# TreeKit 

This repo contains a working proptotype of a new interface for TreeKit. It allows both online (on device), offline (on device) and after the fact (on paper) data entry 
for tree census projects. 

It consists of 

1) A pogstgis database for storage of the relevant data and results 
2) A React based progresive web application that can be run with internet connection of through a service working without 
3) A tiler to be able to produce MVT's of the results 
4) An API to allow the server and the frontend to talk 

### Running the app

The application is run using docker-compose with the command 

```bash
docker-compose up
```

This will spin up the application and you should be able to navigate to [http://localhost:3000](http://localhost:3000) to view it.


