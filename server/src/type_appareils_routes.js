import express from 'express';
import Type_appareil from './type_appareil.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { nom } = req.query;
  
        const options = {
            where: {},
            order: [['id', 'ASC']]
        };
  
        if (nom) {
            options.where.nom = nom;
        }
  
        const types = await Type_appareil.findAll(options);
        res.json(types);
    } catch (error) {
        console.error('Error fetching types', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
router.get('/:id', async (req, res) => {
    const typeId = req.params.id;
  
    try {
      const type = await Type_appareil.findByPk(typeId);
  
      if (type) {
        res.json(type);
      } else {
        res.status(404).json({ message: '404 Not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  
  
router.post('/', async (req, res) => {
      try {
          const newType = await Type_appareil.create(req.body);
          res.status(201).json(newType);
      } catch (error) {
          console.error('Error creating type', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
router.put('/:id', async (req, res) => {
      const typeId = req.params.id;
      try {
          await Type_appareil.update(req.body, { where: { id: typeId } });
          res.status(200).json({ message: 'Type updated successfully' });
      } catch (error) {
          console.error('Error updating type', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
router.delete('/:id', async (req, res) => {
      const typeId = req.params.id;
      try {
          await Type_appareil.destroy({ where: { id: typeId } });
          res.status(200).json({ message: 'Type deleted successfully' });
      } catch (error) {
          console.error('Error deleting type', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
export default router;