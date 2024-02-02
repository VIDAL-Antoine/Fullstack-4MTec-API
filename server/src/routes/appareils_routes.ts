import express, { Request, Response } from 'express';
import Appareil from '../models/appareil';
import ModeleAppareil from '../models/modeleAppareil';
import TypeAppareil from '../models/typeAppareil';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { mac_address, etat, nomModele, nomType, id_modele, type_appareil_id } = req.query;
  const filterOptions: any = {};

  if (id_modele) {
    filterOptions.id_modele = id_modele;
  }

  if (type_appareil_id) {
    filterOptions['$modele.type_appareil_id$'] = type_appareil_id;
  }

  if (mac_address) {
    filterOptions.mac_address = mac_address;
  }

  if (etat) {
    filterOptions.etat = etat;
  }

  if (nomModele) {
    filterOptions['$modele.nomModele$'] = nomModele;
  }

  if (nomType) {
    filterOptions['$modele.type.nomType$'] = nomType;
  }

  try {
    const appareils = await Appareil.findAll({
      where: filterOptions,
      include: [
        { model: ModeleAppareil, as: 'modele', include: [{ model: TypeAppareil, as: 'type' }] }
      ]
    });

    res.json(appareils);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const appareilId = req.params.id;

  try {
    const appareil = await Appareil.findByPk(appareilId, {
      include: [
        { model: ModeleAppareil, as: 'modele', include: [{ model: TypeAppareil, as: 'type' }] }
      ]
    });

    if (!appareil) {
      res.status(404).json({ error: 'Appareil not found' });
      return;
    }

    res.json(appareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id_modele, mac_address, etat } = req.body;
  try {
    const existingAppareil = await Appareil.findOne({
      where: {
        mac_address: {
          [Op.eq]: mac_address,
        },
      },
    });
  
    if (existingAppareil) {
      return res.status(409).json({ error: 'MAC already exists' });
    }
  
    const newAppareil = await Appareil.create({ id_modele, mac_address, etat });
    res.status(201).json(newAppareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const appareilId = req.params.id;
  const { id_modele, mac_address, etat } = req.body;

  try {
    const appareil = await Appareil.findByPk(appareilId);

    if (!appareil) {
      res.status(404).json({ error: 'Appareil not found' });
      return;
    }

    const stateCycle = ['stock', 'installé', 'maintenance'];
    if (!stateCycle.includes(etat)) {
      res.status(400).json({ error: 'Invalid device state value' });
      return;
    }

    await appareil.update({ id_modele, mac_address, etat });
    res.json(appareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const appareilId = req.params.id;

  try {
    const appareil = await Appareil.findByPk(appareilId);

    if (!appareil) {
      res.status(404).json({ error: 'Appareil not found' });
      return;
    }

    await appareil.destroy();
    res.json({ message: 'Appareil deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
