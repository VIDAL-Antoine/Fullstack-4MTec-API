import express, { Request, Response } from 'express';
import ModeleAppareil from '../models/modeleAppareil';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const modeles = await ModeleAppareil.findAll();
    res.json(modeles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const modeleId = req.params.id;

  try {
    const modele = await ModeleAppareil.findByPk(modeleId);

    if (!modele) {
      res.status(404).json({ error: 'Modele not found' });
      return;
    }

    res.json(modele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { nom, type_appareil_id } = req.body;

  try {
    const newModele = await ModeleAppareil.create({ nom, type_appareil_id });
    res.status(201).json(newModele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const modeleId = req.params.id;
  const { nom, type_appareil_id } = req.body;

  try {
    const modele = await ModeleAppareil.findByPk(modeleId);

    if (!modele) {
      res.status(404).json({ error: 'Modele not found' });
      return;
    }

    await modele.update({ nom, type_appareil_id });
    res.json(modele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const modeleId = req.params.id;

  try {
    const modele = await ModeleAppareil.findByPk(modeleId);

    if (!modele) {
      res.status(404).json({ error: 'Modele not found' });
      return;
    }

    await modele.destroy();
    res.json({ message: 'Modele deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
