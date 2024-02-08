import express, { Request, Response } from 'express';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';
import { postModeleAppareilSchema, putModeleAppareilSchema } from '../schemas/ModeleAppareilSchema';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { nomModele, nomType, idTypeAppareil } = req.query;
  const optionsFiltre: any = {};

  if (nomModele) {
    optionsFiltre.nomModele = nomModele;
  }

  if (idTypeAppareil) {
    optionsFiltre.idTypeAppareil = idTypeAppareil;
  }

  if (nomType) {
    optionsFiltre['$type.nom_type$'] = nomType;
  }

  try {
    const modeles = await ModeleAppareil.findAll({
      where: optionsFiltre,
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
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const idModele = req.params.id;

  try {
    const modele = await ModeleAppareil.findByPk(idModele, {
      include: [{ model: TypeAppareil, as: 'type' }]
    });

    if (!modele) {
      res.status(404).json({ error: 'Modele non trouvé' });
      return;
    }

    res.json(modele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  const { nomModele, idTypeAppareil } = req.body;
  
  const { error } = postModeleAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const modeleExistant = await ModeleAppareil.findOne({ where: { nomModele }});

  if (modeleExistant) {
    return res.status(400).json({ error: 'Nom de modèle déjà utilisé' });
  }

  const idTypeExistant = await TypeAppareil.findByPk(idTypeAppareil);

  if (!idTypeExistant) {
    return res.status(404).json({ error: 'ID Type non trouvé' });
  }

  try {
    const nouveauModele = await ModeleAppareil.create({ nomModele, idTypeAppareil });
    res.status(201).json(nouveauModele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const idModele = req.params.id;
  const { nomModele, idTypeAppareil } = req.body;

  const { error } = putModeleAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  if (nomModele) {
    const modeleExistant = await ModeleAppareil.findOne({ where: { nomModele }});

    if (modeleExistant) {
      return res.status(400).json({ error: 'Nom de modèle déjà utilisé' });
    }
  }

  if (idTypeAppareil) {
    const idTypeExistant = await TypeAppareil.findByPk(idTypeAppareil);

    if (!idTypeExistant) {
      return res.status(404).json({ error: 'ID Type non trouvé' });
    }
  }

  try {
    const modele = await ModeleAppareil.findByPk(idModele);

    if (!modele) {
      return res.status(404).json({ error: 'Modele non trouvé' });
    }

    await modele.update({ nomModele, idTypeAppareil });
    res.json(modele);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const idModele = req.params.id;

  try {
    const modele = await ModeleAppareil.findByPk(idModele);

    if (!modele) {
      res.status(404).json({ error: 'Modele non trouvé' });
      return;
    }

    await modele.destroy();
    res.json({ message: 'Modele supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

export default router;
