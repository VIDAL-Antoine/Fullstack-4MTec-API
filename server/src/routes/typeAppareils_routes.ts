import express, { Request, Response } from 'express';
import TypeAppareil from '../models/typeAppareil.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { nomType } = req.query;
  const filterOptions: any = {};

  if (nomType) {
    filterOptions.nomType = nomType;
  }

  try {
    const types = await TypeAppareil.findAll({
      where: filterOptions,
    });

    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const typeId = req.params.id;

  try {
    const type = await TypeAppareil.findByPk(typeId);

    if (!type) {
      res.status(404).json({ error: 'Type not found' });
      return;
    }

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { nom } = req.body;

  try {
    const newType = await TypeAppareil.create({ nom });
    res.status(201).json(newType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const typeId = req.params.id;
  const { nom } = req.body;

  try {
    const type = await TypeAppareil.findByPk(typeId);

    if (!type) {
      res.status(404).json({ error: 'Type not found' });
      return;
    }

    await type.update({ nom });
    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const typeId = req.params.id;

  try {
    const type = await TypeAppareil.findByPk(typeId);

    if (!type) {
      res.status(404).json({ error: 'Type not found' });
      return;
    }

    await type.destroy();
    res.json({ message: 'Type deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
