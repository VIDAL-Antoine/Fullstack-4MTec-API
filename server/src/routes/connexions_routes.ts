import express, { Request, Response } from 'express';
import Connexion from '../models/connexion';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { id_appareil_parent, id_appareil_enfant, datedebut, datefin } = req.query;
    const filterOptions: any = {};
  
    if (id_appareil_parent) {
      filterOptions.id_appareil_parent = id_appareil_parent;
    }
  
    if (id_appareil_enfant) {
      filterOptions.id_appareil_enfant = id_appareil_enfant;
    }
  
    if (datedebut) {
      filterOptions.datedebut = { [Op.gte]: datedebut };
    }

    if (req.query.dateFin || req.query.datefin) {
        const dateFin = req.query.dateFin || req.query.datefin;
        filterOptions.datefin = { 
            [Op.or]: [
                { [Op.lte]: dateFin },
                { [Op.is]: null },
            ],
        };
    }

    if (req.query.datefin === 'undefined' || req.query.datefin === 'none') {
        filterOptions.datefin = { [Op.is]: null };
    }

    try {
      const connexions = await Connexion.findAll({
        where: filterOptions,
      });
  
      res.json(connexions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/:id', async (req: Request, res: Response) => {
  const connexionId = req.params.id;

  try {
    const connexion = await Connexion.findByPk(connexionId);

    if (!connexion) {
      res.status(404).json({ error: 'Connexion not found' });
      return;
    }

    res.json(connexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id_appareil_parent, id_appareil_enfant, datedebut, datefin } = req.body;
  try {
    const newConnexion = await Connexion.create({ id_appareil_parent, id_appareil_enfant, datedebut, datefin});
    res.status(201).json(newConnexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const connexionId = req.params.id;
  const { id_appareil_parent, id_appareil_enfant, datedebut, datefin } = req.body;

  try {
    const connexion = await Connexion.findByPk(connexionId);

    if (!connexion) {
      res.status(404).json({ error: 'Connexion not found' });
      return;
    }

    await connexion.update({ id_appareil_parent, id_appareil_enfant, datedebut, datefin });
    res.json(connexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const connexionId = req.params.id;

  try {
    const connexion = await Connexion.findByPk(connexionId);

    if (!connexion) {
      res.status(404).json({ error: 'Connexion not found' });
      return;
    }

    await connexion.destroy();
    res.json({ message: 'Connexion deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
