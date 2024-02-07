import express, { Request, Response } from 'express';
import TypeAppareil from '../models/typeAppareil.js';
import { typeAppareilSchema } from '../schemas/typeAppareil_schema.js';

const router = express.Router();

const validateTypeAppareil = (req: Request, res: Response, next: Function) => {
  const { error } = typeAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

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
      return res.status(404).json({ error: 'Type not found' });
    }

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', validateTypeAppareil, async (req: Request, res: Response) => {
  const { nomType } = req.body;

  const existingType = await TypeAppareil.findOne({ where: { nomType }});

  if (existingType) {
    return res.status(400).json({ error: 'nomType already exists' });
  }

  try {
    const newType = await TypeAppareil.create({ nomType });
    res.status(201).json(newType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', validateTypeAppareil, async (req: Request, res: Response) => {
  const typeId = req.params.id;
  const { nomType } = req.body;

  const existingType = await TypeAppareil.findOne({ where: { nomType }});

  if (existingType) {
    return res.status(400).json({ error: 'nomType already exists' });
  }

  try {
    const type = await TypeAppareil.findByPk(typeId);

    if (!type) {
      return res.status(404).json({ error: 'Type not found' });
    }

    await type.update({ nomType });
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
      return res.status(404).json({ error: 'Type not found' });
    }

    await type.destroy();
    res.json({ message: 'Type deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
