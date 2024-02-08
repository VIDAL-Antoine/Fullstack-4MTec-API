import express, { Request, Response } from 'express';
import Connexion from '../models/ConnexionModel';
import { Op } from 'sequelize';
import Appareil from '../models/AppareilModel';
import { postConnexionSchema, putConnexionSchema } from '../schemas/ConnexionSchema';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { idAppareilParent, idAppareilEnfant, dateDebut, dateFin,
      adresseMACParent, adresseMACEnfant, etatParent, etatEnfant,
      idModeleAppareilParent, idModeleAppareilEnfant, nomModeleParent, nomModeleEnfant,
      idTypeAppareilParent, idTypeAppareilEnfant, nomTypeParent, nomTypeEnfant} = req.query;
    const optionsFiltre: any = {};
  
    if (idAppareilParent) {
      optionsFiltre.idAppareilParent = idAppareilParent;
    }
  
    if (idAppareilEnfant) {
      optionsFiltre.idAppareilEnfant = idAppareilEnfant;
    }

    if (req.query.dateDebut || req.query.datedebut) {
      const dateDebut = req.query.dateDebut || req.query.datedebut;
      optionsFiltre.dateDebut = { [Op.gte]: dateDebut };
    }

    if (req.query.dateFin || req.query.datefin) {
      const dateFin = req.query.dateFin || req.query.datefin;
      optionsFiltre.dateFin = { [Op.lte]: dateFin };
    }

    if (adresseMACParent) {
      optionsFiltre['$appareilParent.adresse_mac$'] = adresseMACParent;
    }

    if (adresseMACEnfant) {
      optionsFiltre['$appareilEnfant.adresse_mac$'] = adresseMACEnfant;
    }

    if (etatParent) {
      optionsFiltre['$appareilParent.etat$'] = etatParent;
    }

    if (etatEnfant) {
      optionsFiltre['$appareilEnfant.etat$'] = etatEnfant;
    }

    if (idModeleAppareilParent) {
      optionsFiltre['$appareilParent.id_modele_appareil$'] = idModeleAppareilParent;
    }

    if (idModeleAppareilEnfant) {
      optionsFiltre['$appareilEnfant.id_modele_appareil$'] = idModeleAppareilEnfant;
    }

    if (nomModeleParent) {
      optionsFiltre['$appareilParent.modele.nom_modele$'] = nomModeleParent;
    }

    if (nomModeleEnfant) {
      optionsFiltre['$appareilEnfant.modele.nom_modele$'] = nomModeleEnfant;
    }

    if (idTypeAppareilParent) {
      optionsFiltre['$appareilParent.modele.id_type_appareil$'] = idTypeAppareilParent;
    }

    if (idTypeAppareilEnfant) {
      optionsFiltre['$appareilEnfant.modele.id_type_appareil$'] = idTypeAppareilEnfant;
    }

    if (nomTypeParent) {
      optionsFiltre['$appareilParent.modele.type.nom_type$'] = nomTypeParent;
    }

    if (nomTypeEnfant) {
      optionsFiltre['$appareilEnfant.modele.type.nom_type$'] = nomTypeEnfant;
    }

    try {
      const connexions = await Connexion.findAll({
        where: optionsFiltre,
        include: [
          { model: Appareil, as: 'appareilParent',
            include: [{ model: ModeleAppareil, as: 'modele',
              include: [{ model: TypeAppareil, as: 'type'}]
            }]
          },
          { model: Appareil, as: 'appareilEnfant',
            include: [{ model: ModeleAppareil, as: 'modele',
              include: [{ model: TypeAppareil, as: 'type'}]
            }]
          },
        ]
      });
  
      res.json(connexions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne au serveur' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
  const idConnexion = req.params.id;

  try {
    const connexion = await Connexion.findByPk(idConnexion, {
      include: [
        { model: Appareil, as: 'appareilParent',
          include: [{ model: ModeleAppareil, as: 'modele',
            include: [{ model: TypeAppareil, as: 'type'}]
          }]
        },
        { model: Appareil, as: 'appareilEnfant',
          include: [{ model: ModeleAppareil, as: 'modele',
            include: [{ model: TypeAppareil, as: 'type'}]
          }]
        },
      ]
    });

    if (!connexion) {
      return res.status(404).json({ error: 'Connexion non trouvée' });
    }

    res.json(connexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { idAppareilParent, idAppareilEnfant, dateDebut, dateFin } = req.body;
  const { error } = postConnexionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (idAppareilEnfant === idAppareilParent) {
    return res.status(400).json({ error: "Le parent et l'enfant doivent être des appareils différents."})
  }

  const appareilParent = await Appareil.findByPk(idAppareilParent);
  const appareilEnfant = await Appareil.findByPk(idAppareilEnfant);

  if (!appareilParent) {
    return res.status(400).json({ error: "Pas d'appareil trouvé avec l'id parent fourni."});
  }

  if (appareilParent?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil parent doit être à l'état 'installé' pour être connecté."});
  }

  if (!appareilEnfant) {
    return res.status(400).json({ error: "Pas d'appareil trouvé avec l'id enfant fourni."});
  }

  if (appareilEnfant?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil enfant doit être à l'état 'installé' pour être connecté."});
  }

  if (dateDebut >= dateFin) {
    return res.status(400).json({ error: "La date de début doit être antérieure à la date de fin."});
  }

  const connexionsExistantes = await Connexion.findAll({
    where: {
      idAppareilEnfant,
      [Op.and]: {
          dateDebut: { [Op.lte]: dateFin },
          dateFin: { [Op.gte]: dateDebut }
      },
    },
  });

  if (connexionsExistantes.length > 0) {
    return res.status(400).json({ error: "Les dates se chevauchent pour l'appareil enfant." });
  }

  try {
    const nouvelleConnexion = await Connexion.create({ idAppareilParent, idAppareilEnfant, dateDebut, dateFin });
    res.status(201).json(nouvelleConnexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const idConnexion = req.params.id;
  const { idAppareilParent, idAppareilEnfant, dateDebut, dateFin } = req.body;

  const { error } = putConnexionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const connexion = await Connexion.findByPk(idConnexion);

  if (!connexion) {
    return res.status(404).json({ error: 'Connexion non trouvée' });
  }

  if ((idAppareilEnfant && idAppareilParent && idAppareilEnfant === idAppareilParent) || connexion.idAppareilEnfant === idAppareilParent || connexion.idAppareilParent === idAppareilEnfant) {
    return res.status(400).json({ error: "Le parent et l'enfant doivent être des appareils différents."})
  }

  if (dateDebut >= dateFin || connexion.dateDebut >= dateFin || connexion.dateFin <= dateDebut) {
    return res.status(400).json({ error: "La date de début doit être antérieure à la date de fin."});
  }

  if (idAppareilParent) {
    const appareilParent = await Appareil.findByPk(idAppareilParent);

    if (!appareilParent) {
      return res.status(400).json({ error: "Pas d'appareil trouvé avec l'id parent fourni."});
    }

    if (appareilParent?.etat !== 'installé') {
      return res.status(400).json({ error: "L'appareil parent doit être à l'état 'installé' pour être connecté."});
    }
  }

  if (idAppareilEnfant) {
    const now = new Date().toLocaleDateString().split("/");
    let dateFin = '9999-12-31';
    let dateDebut = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

    const appareilEnfant = await Appareil.findByPk(idAppareilEnfant);

    if (!appareilEnfant) {
      return res.status(400).json({ error: "Pas d'appareil trouvé avec l'id enfant fourni."});
    }

    if (appareilEnfant?.etat !== 'installé') {
      return res.status(400).json({ error: "L'appareil enfant doit être à l'état 'installé' pour être connecté."});
    }
    
    if (dateDebut) {
      dateDebut = dateDebut;
    }

    if (dateFin) {
      dateFin = dateFin;
    }
    
    const connexionsExistantes = await Connexion.findAll({
      where: {
        idAppareilEnfant,
        [Op.and]: {
            dateDebut: { [Op.lte]: dateFin },
            dateFin: { [Op.gte]: dateDebut }
        },
      },
    });

    if (connexionsExistantes.length > 0) {
      return res.status(400).json({ error: "Les dates se chevauchent pour l'appareil enfant." });
    }
  }

  try {
    await connexion.update({ idAppareilParent, idAppareilEnfant, dateDebut, dateFin });
    res.json(connexion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const idConnexion = req.params.id;

  try {
    const connexion = await Connexion.findByPk(idConnexion);

    if (!connexion) {
      return res.status(404).json({ error: 'Connexion non trouvée' });
    }

    await connexion.destroy();
    res.json({ message: 'Connexion supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

export default router;
