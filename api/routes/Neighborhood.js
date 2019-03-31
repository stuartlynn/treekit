import express from 'express';

export default models => {
  const router = express.Router();
  const {Neighborhood} = models;

  // Get all
  router.get('/', async (req, res) => {
    let filters = {};

    const projectId = req.query.projectId;
    if (projectId) {
      filters = {...filters, ...{projectId}};
    }

    const offset = req.params.offset ? {offset : req.params.offset} :  {};
    const limit = req.params.limit ? {limit : req.params.limit} : {};

    try {
      const projects = await Neighborhood.findAll({
        where: {
          ...filters,
        },
        ...offset,
        ...limit,
      });
      res.json(projects);
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
    const neighborhood = await Neighborhood.findByPk(id);

    if (neighborhood) {
      res.json(neighborhood);
    } else {
      res.status(404).send('Not Found');
    }
  });

  router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      Neighborhood.destroy({
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
      const neighborhood = Neighborhood.update(
        {
          ...body,
        },
        {
          where: {id},
        },
      );
      res.json(project);
    } catch (error) {
      res.json({
        error,
      });
    }
  });

  return router;
};
