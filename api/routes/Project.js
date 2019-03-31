import express from 'express';

export default models => {
  const router = express.Router();
  const {Project} = models;

  // Get all
  router.get('/', async (req, res) => {
    const offset = req.params.offset ? req.params.offset : 0;
    const limit = req.params.limit ? req.params.limit : 20;

    try {
      const projects = await Project.findAll({offset, limit});
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
    let project = null;
    if (parseInt(id)) {
      project = await Project.findByPk(id);
    } else {
      project = await Project.findOne({where: {slug: id}});
    }

    if (project) {
      res.json(project);
    } else {
      res.status(404).send('Not Found');
    }
  });

  router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
      Project.destroy({
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
      const project = Project.update(
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

//router.post('/',async (req,res)=>{

//})
