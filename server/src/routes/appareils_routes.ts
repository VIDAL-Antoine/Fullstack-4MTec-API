import express, { Request, Response } from 'express';
import Appareil from '../models/appareil';
import ModeleAppareil from '../models/modeleAppareil';
import TypeAppareil from '../models/typeAppareil';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const appareils = await Appareil.findAll({
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
