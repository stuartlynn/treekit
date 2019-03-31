
import express from 'express';

export default models => {
  const router = express.Router();
  const {Street} = models;

  // Get all
  router.get('/', async (req, res) => {
    let filters = {}

    const neighborhoodId= req.query.neighborhoodId
    if(neighborhoodId){
        filters = {...filters, ...{neighborhoodId}}
    }

    const offset = req.params.offset ? {offset : req.params.offset} : {};
    const limit = req.params.limit ? {limit: req.params.limit} : {};

    try {
      const streets = await Street.findAll({where:{
        ...filters
      },...offset, ...limit});
      res.json(streets);
    } catch (err) {
      console.log(err);
      res.json({
        error: err,
      });
    }
  });

  // Get project by id or name
  router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const street = await Project.findByPk(id);

    if (street) {
      res.json(street);
    } else {
      res.status(404).send('Not Found');
    }
  });

  router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      Street.destroy({
        where: {
          id,
        },
      });
      res.status(202).send('Deleted');
    } catch {
      res.status(404).send('not found');
    }
  });

  router.put('/:id', async (req, res) => {
    const {id} = req.param;

    try {
      const street = Project.update(
        {
          ...body,
        },
        {
          where: {id},
        },
      );
      res.json(street);
    } catch (error) {
      res.json({
        error,
      });
    }
  });

  return router;
};
