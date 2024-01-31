import express from 'express';
import Modele_appareil from './modele_appareil.js';
import Type_appareil from './type_appareil.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { nom } = req.query;

    const options = {
      include: Type_appareil,
      where: {},
      order: [['id', 'ASC']],
    };

    if (nom) {
      options.where.nom = nom;
    }

    const models = await Modele_appareil.findAll(options);

    const transformedModels = models.map(model => ({
      id: model.id,
      nom: model.nom,
      type_appareil_id: model.type_appareil_id,
      nomType: model.Type_appareil ? model.Type_appareil.nom : null,
    }));

    res.json(transformedModels);
  } catch (error) {
    console.error('Error fetching models', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const modelId = req.params.id;

  try {
    const model = await Modele_appareil.findByPk(modelId, {
      include: Type_appareil,
    });

    if (model) {
      const transformedModel = {
        id: model.id,
        nom: model.nom,
        type_appareil_id: model.type_appareil_id,
        nomType: model.Type_appareil ? model.Type_appareil.nom : null,
      };

      res.json(transformedModel);
    } else {
      res.status(404).json({ message: '404 Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/by-type/:nomType', async (req, res) => {
  try {
    const { nomType } = req.params;

    const models = await Modele_appareil.findAll({
      include: Type_appareil,
      where: {
        '$Type_appareil.nom$': nomType,
      },
    });

    const transformedModels = models.map(model => ({
      id: model.id,
      nom: model.nom,
      type_appareil_id: model.type_appareil_id,
      nomType: model.Type_appareil ? model.Type_appareil.nom : null,
    }));

    res.json(transformedModels);
  } catch (error) {
    console.error('Error fetching models by type name', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/by-type-id/:idType', async (req, res) => {
  try {
    const { idType } = req.params;

    const models = await Modele_appareil.findAll({
      include: Type_appareil,
      where: {
        type_appareil_id: idType,
      },
    });

    const transformedModels = models.map(model => ({
      id: model.id,
      nom: model.nom,
      type_appareil_id: model.type_appareil_id,
      nomType: model.Type_appareil ? model.Type_appareil.nom : null,
    }));

    res.json(transformedModels);
  } catch (error) {
    console.error('Error fetching models by type ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
  
  
router.post('/', async (req, res) => {
      try {
          const newModel = await Modele_appareil.create(req.body);
          res.status(201).json(newModel);
      } catch (error) {
          console.error('Error creating model', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
});
  
router.put('/:id', async (req, res) => {
      const modelId = req.params.id;
      try {
          await Modele_appareil.update(req.body, { where: { id: modelId } });
          res.status(200).json({ message: 'Model updated successfully' });
      } catch (error) {
          console.error('Error updating model', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
});
  
router.delete('/:id', async (req, res) => {
      const modelId = req.params.id;
      try {
          await Modele_appareil.destroy({ where: { id: modelId } });
          res.status(200).json({ message: 'Model deleted successfully' });
      } catch (error) {
          console.error('Error deleting model', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
});
  
export default router;