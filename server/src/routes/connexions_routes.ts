import express, { Request, Response } from 'express';
import Connexion from '../models/connexion';
import { Op } from 'sequelize';
import Appareil from '../models/appareil';

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
        filterOptions.datefin = { [Op.lte]: dateFin };
    }

    try {
      const connexions = await Connexion.findAll({
        where: filterOptions,
        include: [
          { model: Appareil, as: 'appareilParent' },
          { model: Appareil, as: 'appareilEnfant' }
        ]
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
    const existingConnexions = await Connexion.findAll({
      where: {
        id_appareil_enfant,
        [Op.and]: {
            datedebut: { [Op.lte]: datefin },
            datefin: { [Op.gte]: datedebut }
        },
      },
    });

    if (existingConnexions.length > 0) {
      return res.status(400).json({ error: "Les dates se chevauchent pour l'appareil enfant." });
    }

    const newConnexion = await Connexion.create({ id_appareil_parent, id_appareil_enfant, datedebut, datefin });
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
