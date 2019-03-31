import express from 'express';
import connect from './db';
import ProjectRoutes from './routes/Project';
import NeighborhoodRoutes from './routes/Neighborhood'
import StreetRoutes from './routes/Street'
const app = express();
const port = 3000;

connect().then(([models, db]) => {
  app.get('/', (req, res) => res.send('Hello Trees!'));
  app.use('/projects', ProjectRoutes(models));
  app.use('/neighborhoods', NeighborhoodRoutes(models));
  app.use('/streets', StreetRoutes(models));

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
