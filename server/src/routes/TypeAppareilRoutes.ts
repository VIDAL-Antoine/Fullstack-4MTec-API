import express, { Request, Response } from 'express';
import TypeAppareil from '../models/TypeAppareilModel.js';
import { typeAppareilSchema } from '../schemas/TypeAppareilSchema.js';

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
  const optionsFiltre: any = {};

  if (nomType) {
    optionsFiltre.nomType = nomType;
  }

  try {
    const types = await TypeAppareil.findAll({
      where: optionsFiltre,
    });

    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const idType = req.params.id;

  try {
    const type = await TypeAppareil.findByPk(idType);

    if (!type) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.post('/', validateTypeAppareil, async (req: Request, res: Response) => {
  const { nomType } = req.body;

  const typeExistant = await TypeAppareil.findOne({ where: { nomType }});

  if (typeExistant) {
    return res.status(400).json({ error: 'Nom de type déjà utilisé' });
  }

  try {
    const newType = await TypeAppareil.create({ nomType });
    res.status(201).json(newType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.put('/:id', validateTypeAppareil, async (req: Request, res: Response) => {
  const idType = req.params.id;
  const { nomType } = req.body;

  const typeExistant = await TypeAppareil.findOne({ where: { nomType }});

  if (typeExistant) {
    return res.status(400).json({ error: 'Nom de type déjà utilisé' });
  }

  try {
    const type = await TypeAppareil.findByPk(idType);

    if (!type) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }

    await type.update({ nomType });
    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const idType = req.params.id;

  try {
    const type = await TypeAppareil.findByPk(idType);

    if (!type) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }

    await type.destroy();
    res.json({ message: 'Type supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

export default router;
