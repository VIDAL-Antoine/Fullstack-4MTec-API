import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Type_appareil from './type_appareil.js';
import Modele_appareil from './modele_appareil.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/type_appareils', async (req, res) => {
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


app.get('/type_appareils/:id', async (req, res) => {
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




app.post('/type_appareils', async (req, res) => {
    try {
        const newType = await Type_appareil.create(req.body);
        res.status(201).json(newType);
    } catch (error) {
        console.error('Error creating type', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/type_appareils/:id', async (req, res) => {
    const typeId = req.params.id;
    try {
        await Type_appareil.update(req.body, { where: { id: typeId } });
        res.status(200).json({ message: 'Type updated successfully' });
    } catch (error) {
        console.error('Error updating type', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/type_appareils/:id', async (req, res) => {
    const typeId = req.params.id;
    try {
        await Type_appareil.destroy({ where: { id: typeId } });
        res.status(200).json({ message: 'Type deleted successfully' });
    } catch (error) {
        console.error('Error deleting type', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.NODE_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
