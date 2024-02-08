import express, { Request, Response } from 'express';
import Appareil from '../models/AppareilModel';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';
import { Op } from 'sequelize';
import { postAppareilSchema, putAppareilSchema } from '../schemas/AppareilSchema';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { adresseMAC, etat, nomModele, nomType, idModeleAppareil, idTypeAppareil } = req.query;
  const optionsFiltre: any = {};

  if (idModeleAppareil) {
    optionsFiltre.idModeleAppareil = idModeleAppareil;
  }

  if (idTypeAppareil) {
    optionsFiltre['$modele.id_type_appareil$'] = idTypeAppareil;
  }

  if (adresseMAC) {
    optionsFiltre.adresseMAC = adresseMAC;
  }

  if (etat) {
    optionsFiltre.etat = etat;
  }

  if (nomModele) {
    optionsFiltre['$modele.nom_modele$'] = nomModele;
  }

  if (nomType) {
    optionsFiltre['$modele.type.nom_type$'] = nomType;
  }

  try {
    const appareils = await Appareil.findAll({
      where: optionsFiltre,
      include: [
        { model: ModeleAppareil, as: 'modele', include: [{ model: TypeAppareil, as: 'type' }] }
      ]
    });

    res.json(appareils);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const idAppareil = req.params.id;

  try {
    const appareil = await Appareil.findByPk(idAppareil, {
      include: [
        { model: ModeleAppareil, as: 'modele', include: [{ model: TypeAppareil, as: 'type' }] }
      ]
    });

    if (!appareil) {
      return res.status(404).json({ error: 'Appareil non trouvé' });
    }

    res.json(appareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { idModeleAppareil, adresseMAC, etat } = req.body;

  const { error } = postAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const idModeleAppareilExistant = await ModeleAppareil.findByPk(idModeleAppareil);

  if (!idModeleAppareilExistant) {
    return res.status(404).json({ error: 'ID Modèle non trouvé' });
  }

  const appareilExistant = await Appareil.findOne({
    where: {
      adresseMAC: {
        [Op.eq]: adresseMAC,
      },
    },
  });

  if (appareilExistant) {
    return res.status(409).json({ error: 'Adresse MAC déjà utilisée' });
  }

  try {  
    const nouvelAppareil = await Appareil.create({ idModeleAppareil, adresseMAC, etat });
    res.status(201).json(nouvelAppareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const idAppareil = req.params.id;
  const { idModeleAppareil, adresseMAC, etat } = req.body;

  const { error } = putAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (idModeleAppareil) {
    const idModeleAppareilExistant = await ModeleAppareil.findByPk(idModeleAppareil);

    if (!idModeleAppareilExistant) {
      return res.status(404).json({ error: 'ID Modèle non trouvé' });
    }
  }

  if (adresseMAC) {
    const appareilExistant = await Appareil.findOne({
      where: {
        adresseMAC: {
          [Op.eq]: adresseMAC,
        },
      },
    });
  
    if (appareilExistant) {
      return res.status(409).json({ error: 'Adresse MAC déjà utilisée' });
    }
  }

  try {
    const appareil = await Appareil.findByPk(idAppareil);

    if (!appareil) {
      return res.status(404).json({ error: 'Appareil non trouvé' });
    }

    await appareil.update({ idModeleAppareil, adresseMAC, etat });
    res.json(appareil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const idAppareil = req.params.id;

  try {
    const appareil = await Appareil.findByPk(idAppareil);

    if (!appareil) {
      return res.status(404).json({ error: 'Appareil non trouvé' });
    }

    await appareil.destroy();
    res.json({ message: 'Appareil supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

export default router;
