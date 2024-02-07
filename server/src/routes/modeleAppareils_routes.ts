import express, { Request, Response } from 'express';
import ModeleAppareil from '../models/modeleAppareil';
import TypeAppareil from '../models/typeAppareil';
import { postModeleAppareilSchema, putModeleAppareilSchema } from '../schemas/modeleAppareil_schema';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { nomModele, nomType, type_appareil_id } = req.query;
  const filterOptions: any = {};

  if (nomModele) {
    filterOptions.nomModele = nomModele;
  }

  if (type_appareil_id) {
    filterOptions.type_appareil_id = type_appareil_id;
  }

  if (nomType) {
    filterOptions['$type.nomType$'] = nomType;
  }

  try {
    const modeles = await ModeleAppareil.findAll({
      where: filterOptions,
      include: [
        {
          model: TypeAppareil,
          as: 'type',
        },
      ],
    });

    res.json(modeles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const modeleId = req.params.id;

  try {
    const modele = await ModeleAppareil.findByPk(modeleId, {
      include: [{ model: TypeAppareil, as: 'type' }]
    });

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
  const { nomModele, type_appareil_id } = req.body;
  
  const { error } = postModeleAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const existingModele = await ModeleAppareil.findOne({ where: { nomModele }});

  if (existingModele) {
    return res.status(400).json({ error: 'nomModele already exists' });
  }

  const existingIDType = await TypeAppareil.findByPk(type_appareil_id);

  if (!existingIDType) {
    return res.status(404).json({ error: 'ID Type non trouvé' });
  }

  try {
    const newModele = await ModeleAppareil.create({ nomModele, type_appareil_id });
    res.status(201).json(newModele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const modeleId = req.params.id;
  const { nomModele, type_appareil_id } = req.body;

  const { error } = putModeleAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  if (nomModele) {
    const existingModele = await ModeleAppareil.findOne({ where: { nomModele }});

    if (existingModele) {
      return res.status(400).json({ error: 'nomModele already exists' });
    }
  }

  if (type_appareil_id) {
    const existingIDType = await TypeAppareil.findByPk(type_appareil_id);

    if (!existingIDType) {
      return res.status(404).json({ error: 'ID Type non trouvé' });
    }
  }

  try {
    const modele = await ModeleAppareil.findByPk(modeleId);

    if (!modele) {
      return res.status(404).json({ error: 'Modele not found' });
    }

    await modele.update({ nomModele, type_appareil_id });
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
