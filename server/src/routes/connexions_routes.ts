import express, { Request, Response } from 'express';
import Connexion from '../models/connexion';
import { Op } from 'sequelize';
import Appareil from '../models/appareil';
import { postConnexionSchema, putConnexionSchema } from '../schemas/connexion_schema';

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
      return res.status(404).json({ error: 'Connexion not found' });
    }

    res.json(connexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { id_appareil_parent, id_appareil_enfant, datedebut, datefin } = req.body;
  const { error } = postConnexionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const parentAppareil = await Appareil.findByPk(id_appareil_parent);
  const childAppareil = await Appareil.findByPk(id_appareil_enfant);

  if (!parentAppareil) {
    return res.status(400).json({ error: "Pas de connexion trouvée avec l'id parent fourni."});
  }

  if (parentAppareil?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil parent doit être à l'état 'installé' pour être connecté."});
  }

  if (!childAppareil) {
    return res.status(400).json({ error: "Pas de connexion trouvée avec l'id enfant fourni."});
  }

  if (childAppareil?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil enfant doit être à l'état 'installé' pour être connecté."});
  }

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

  try {
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

  const { error } = putConnexionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const connexion = await Connexion.findByPk(connexionId);

  if (!connexion) {
    return res.status(404).json({ error: 'Connexion not found' });
  }

  if (id_appareil_parent) {
    const parentAppareil = await Appareil.findByPk(id_appareil_parent);

    if (!parentAppareil) {
      return res.status(400).json({ error: "Pas de connexion trouvée avec l'id parent fourni."});
    }

    if (parentAppareil?.etat !== 'installé') {
      return res.status(400).json({ error: "L'appareil parent doit être à l'état 'installé' pour être connecté."});
    }
  }

  if (id_appareil_enfant) {
    const now = new Date().toLocaleDateString().split("/");
    let datefin = '9999-12-31';
    let datedebut = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

    const childAppareil = await Appareil.findByPk(id_appareil_enfant);

    if (!childAppareil) {
      return res.status(400).json({ error: "Pas de connexion trouvée avec l'id enfant fourni."});
    }

    if (childAppareil?.etat !== 'installé') {
      return res.status(400).json({ error: "L'appareil enfant doit être à l'état 'installé' pour être connecté."});
    }
    
    if (datedebut) {
      datedebut = datedebut;
    }

    if (datefin) {
      datefin = datefin;
    }
    
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
  }

  try {
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
      return res.status(404).json({ error: 'Connexion not found' });
    }

    await connexion.destroy();
    res.json({ message: 'Connexion deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
