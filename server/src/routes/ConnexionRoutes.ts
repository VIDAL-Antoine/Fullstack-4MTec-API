import express, { Request, Response } from 'express';
import Connexion from '../models/ConnexionModel';
import { Op } from 'sequelize';
import Appareil from '../models/AppareilModel';
import { postConnexionSchema, putConnexionSchema } from '../schemas/ConnexionSchema';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';

const router = express.Router();

/**
 * @api {get} /connexions Récupérer toutes les connexions
 * @apiVersion 0.1.0
 * @apiName GetConnexions
 * @apiGroup Connexions
 *
 * @apiParam {Number} [idAppareilParent] ID de l'appareil parent.
 * @apiParam {Number} [idAppareilEnfant] ID de l'appareil enfant.
 * @apiParam {String} [dateDebut] Date de début de la connexion (au format 'YYYY-MM-DD'). Renvoie les dates de début se trouvant après ce paramètre.
 * @apiParam {String} [dateFin] Date de fin de la connexion (au format 'YYYY-MM-DD'). Renvoie les dates de fin se trouvant avant ce paramètre.
 * @apiParam {String} [adresseMACParent] Adresse MAC de l'appareil parent.
 * @apiParam {String} [adresseMACEnfant] Adresse MAC de l'appareil enfant.
 * @apiParam {String} [etatParent] État de l'appareil parent.
 * @apiParam {String} [etatEnfant] État de l'appareil enfant.
 * @apiParam {Number} [idModeleAppareilParent] ID du modèle de l'appareil parent.
 * @apiParam {Number} [idModeleAppareilEnfant] ID du modèle de l'appareil enfant.
 * @apiParam {String} [nomModeleParent] Nom du modèle de l'appareil parent.
 * @apiParam {String} [nomModeleEnfant] Nom du modèle de l'appareil enfant.
 * @apiParam {Number} [idTypeAppareilParent] ID du type de l'appareil parent.
 * @apiParam {Number} [idTypeAppareilEnfant] ID du type de l'appareil enfant.
 * @apiParam {String} [nomTypeParent] Nom du type de l'appareil parent.
 * @apiParam {String} [nomTypeEnfant] Nom du type de l'appareil enfant.
 *
 * @apiSuccess {Object[]} connexions Liste des connexions.
 * @apiSuccess {Number} idConnexion ID de la connexion.
 * @apiSuccess {String} dateDebut Date de début de la connexion.
 * @apiSuccess {String} dateFin Date de fin de la connexion.
 * @apiSuccess {Object} appareilParent Détails de l'appareil parent.
 * @apiSuccess {Number} appareilParent.idAppareil ID de l'appareil parent.
 * @apiSuccess {String} appareilParent.adresseMAC Adresse MAC de l'appareil parent.
 * @apiSuccess {String} appareilParent.etat État de l'appareil parent.
 * @apiSuccess {Object} appareilParent.modele Détails du modèle de l'appareil parent.
 * @apiSuccess {Number} appareilParent.modele.idModele ID du modèle de l'appareil parent.
 * @apiSuccess {String} appareilParent.modele.nomModele Nom du modèle de l'appareil parent.
 * @apiSuccess {Object} appareilParent.modele.type Détails du type de l'appareil parent.
 * @apiSuccess {Number} appareilParent.modele.type.idType ID du type de l'appareil parent.
 * @apiSuccess {String} appareilParent.modele.type.nomType Nom du type de l'appareil parent.
 * @apiSuccess {Object} appareilEnfant Détails de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.idAppareil ID de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.adresseMAC Adresse MAC de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.etat État de l'appareil enfant.
 * @apiSuccess {Object} appareilEnfant.modele Détails du modèle de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.modele.idModele ID du modèle de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.modele.nomModele Nom du modèle de l'appareil enfant.
 * @apiSuccess {Object} appareilEnfant.modele.type Détails du type de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.modele.type.idType ID du type de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.modele.type.nomType Nom du type de l'appareil enfant.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *         "idConnexion": 3,
 *         "idAppareilParent": 1,
 *         "idAppareilEnfant": 4,
 *         "dateDebut": "2022-09-01",
 *         "dateFin": "2022-11-30",
 *         "appareilParent": {
 *             "idAppareil": 1,
 *             "idModeleAppareil": 1,
 *             "adresseMAC": "11:22:33:44:55:66",
 *             "etat": "installé",
 *             "modele": {
 *                 "idModele": 1,
 *                 "nomModele": "Box OCP",
 *                 "idTypeAppareil": 1,
 *                 "type": {
 *                     "idType": 1,
 *                     "nomType": "Box"
 *                 }
 *             }
 *         },
 *         "appareilEnfant": {
 *             "idAppareil": 4,
 *             "idModeleAppareil": 4,
 *             "adresseMAC": "11:22:33:44:55:99",
 *             "etat": "maintenance",
 *             "modele": {
 *                 "idModele": 4,
 *                 "nomModele": "Chaudière OCP Capri",
 *                 "idTypeAppareil": 3,
 *                 "type": {
 *                     "idType": 3,
 *                     "nomType": "Chaudière"
 *                 }
 *             }
 *         }
 *     },
 *     ...
 *     ]
 *
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {get} /connexions/:id Récupérer une connexion par son ID
 * @apiVersion 0.1.0
 * @apiName GetConnexionById
 * @apiGroup Connexions
 *
 * @apiParam {Number} id ID de la connexion à récupérer.
 *
 * @apiSuccess {Number} idConnexion ID de la connexion.
 * @apiSuccess {String} dateDebut Date de début de la connexion.
 * @apiSuccess {String} dateFin Date de fin de la connexion.
 * @apiSuccess {Object} appareilParent Détails de l'appareil parent.
 * @apiSuccess {Number} appareilParent.idAppareil ID de l'appareil parent.
 * @apiSuccess {String} appareilParent.adresseMAC Adresse MAC de l'appareil parent.
 * @apiSuccess {String} appareilParent.etat État de l'appareil parent.
 * @apiSuccess {Object} appareilParent.modele Détails du modèle de l'appareil parent.
 * @apiSuccess {Number} appareilParent.modele.idModele ID du modèle de l'appareil parent.
 * @apiSuccess {String} appareilParent.modele.nomModele Nom du modèle de l'appareil parent.
 * @apiSuccess {Object} appareilParent.modele.type Détails du type de l'appareil parent.
 * @apiSuccess {Number} appareilParent.modele.type.idType ID du type de l'appareil parent.
 * @apiSuccess {String} appareilParent.modele.type.nomType Nom du type de l'appareil parent.
 * @apiSuccess {Object} appareilEnfant Détails de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.idAppareil ID de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.adresseMAC Adresse MAC de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.etat État de l'appareil enfant.
 * @apiSuccess {Object} appareilEnfant.modele Détails du modèle de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.modele.idModele ID du modèle de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.modele.nomModele Nom du modèle de l'appareil enfant.
 * @apiSuccess {Object} appareilEnfant.modele.type Détails du type de l'appareil enfant.
 * @apiSuccess {Number} appareilEnfant.modele.type.idType ID du type de l'appareil enfant.
 * @apiSuccess {String} appareilEnfant.modele.type.nomType Nom du type de l'appareil enfant.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "idConnexion": 3,
 *         "idAppareilParent": 1,
 *         "idAppareilEnfant": 4,
 *         "dateDebut": "2022-09-01",
 *         "dateFin": "2022-11-30",
 *         "appareilParent": {
 *             "idAppareil": 1,
 *             "idModeleAppareil": 1,
 *             "adresseMAC": "11:22:33:44:55:66",
 *             "etat": "installé",
 *             "modele": {
 *                 "idModele": 1,
 *                 "nomModele": "Box OCP",
 *                 "idTypeAppareil": 1,
 *                 "type": {
 *                     "idType": 1,
 *                     "nomType": "Box"
 *                 }
 *             }
 *         },
 *         "appareilEnfant": {
 *             "idAppareil": 4,
 *             "idModeleAppareil": 4,
 *             "adresseMAC": "11:22:33:44:55:99",
 *             "etat": "maintenance",
 *             "modele": {
 *                 "idModele": 4,
 *                 "nomModele": "Chaudière OCP Capri",
 *                 "idTypeAppareil": 3,
 *                 "type": {
 *                     "idType": 3,
 *                     "nomType": "Chaudière"
 *                 }
 *             }
 *         }
 *     }
 * 
 * @apiError (Error 404) {String} error Connexion non trouvée.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {post} /connexions Créer une nouvelle connexion
 * @apiVersion 0.1.0
 * @apiName CreateConnexion
 * @apiGroup Connexions
 *
 * @apiBody {Number} idAppareilParent ID de l'appareil parent.
 * @apiBody {Number} idAppareilEnfant ID de l'appareil enfant.
 * @apiBody {Date} dateDebut Date de début de la connexion (au format 'YYYY-MM-DD').
 * @apiBody {Date} [dateFin="9999-12-31"] Date de fin de la connexion (au format 'YYYY-MM-DD'). Si non fournie, la valeur par défaut est '9999-12-31'.
 *
 * @apiSuccess {Number} idConnexion ID de la connexion créée.
 * @apiSuccess {Number} idAppareilParent ID de l'appareil parent de la connexion créée.
 * @apiSuccess {Number} idAppareilEnfant ID de l'appareil enfant de la connexion créée.
 * @apiSuccess {Date} dateDebut Date de début de la connexion (au format 'YYYY-MM-DD') de la connexion créée.
 * @apiSuccess {Date} dateFin Datee de fin de la connexion (au format 'YYYY-MM-DD') de la connexion créée.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "idConnexion": 9,
 *         "idAppareilParent": 6,
 *         "idAppareilEnfant": 7,
 *         "dateDebut": "2024-02-09",
 *         "dateFin": "2024-05-23",
 *     }
 *
 * @apiError (Error 400) {String} error Données invalides.
 * @apiError (Error 400) {String} error Le parent et l'enfant doivent être des appareils différents.
 * @apiError (Error 400) {String} error L'appareil parent doit être à l'état 'installé' pour être connecté.
 * @apiError (Error 400) {String} error L'appareil enfant doit être à l'état 'installé' pour être connecté.
 * @apiError (Error 400) {String} error La date de début doit être antérieure à la date de fin.
 * @apiError (Error 400) {String} error Les dates se chevauchent pour l'appareil enfant.
 * @apiError (Error 404) {String} error Pas d'appareil trouvé avec l'id parent fourni.
 * @apiError (Error 404) {String} error Pas d'appareil trouvé avec l'id enfant fourni.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', async (req: Request, res: Response) => {
  const { idAppareilParent, idAppareilEnfant, dateDebut } = req.body;
  const { error } = postConnexionSchema.validate(req.body);
  const dateFin = req.body.dateFin || '9999-12-31';

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (idAppareilEnfant === idAppareilParent) {
    return res.status(400).json({ error: "Le parent et l'enfant doivent être des appareils différents."})
  }

  const appareilParent = await Appareil.findByPk(idAppareilParent);
  const appareilEnfant = await Appareil.findByPk(idAppareilEnfant);

  if (!appareilParent) {
    return res.status(404).json({ error: "Pas d'appareil trouvé avec l'id parent fourni."});
  }

  if (appareilParent?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil parent doit être à l'état 'installé' pour être connecté."});
  }

  if (!appareilEnfant) {
    return res.status(404).json({ error: "Pas d'appareil trouvé avec l'id enfant fourni."});
  }

  if (appareilEnfant?.etat !== 'installé') {
    return res.status(400).json({ error: "L'appareil enfant doit être à l'état 'installé' pour être connecté."});
  }

  if (dateDebut > dateFin) {
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

/**
 * @api {put} /connexions/:id Mettre à jour une connexion
 * @apiVersion 0.1.0
 * @apiName UpdateConnexion
 * @apiGroup Connexions
 *
 * @apiParam {Number} id ID de la connexion à mettre à jour.
 * @apiBody {Number} [idAppareilParent] ID de l'appareil parent.
 * @apiBody {Number} [idAppareilEnfant] ID de l'appareil enfant.
 * @apiBody {Date} [dateDebut] Date de début de la connexion (au format 'YYYY-MM-DD').
 * @apiBody {Date} [dateFin] Date de fin de la connexion (au format 'YYYY-MM-DD').
 *
 * @apiSuccess {Number} idConnexion ID de la connexion mise à jour.
 * @apiSuccess {Number} idAppareilParent ID de l'appareil parent de la connexion mise à jour.
 * @apiSuccess {Number} idAppareilEnfant ID de l'appareil enfant de la connexion mise à jour.
 * @apiSuccess {Date} dateDebut Date de début de la connexion (au format 'YYYY-MM-DD') de la connexion mise à jour.
 * @apiSuccess {Date} dateFin Date de fin de la connexion (au format 'YYYY-MM-DD') de la connexion mise à jour.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "idConnexion": 9,
 *         "idAppareilParent": 6,
 *         "idAppareilEnfant": 7,
 *         "dateDebut": "2024-02-09",
 *         "dateFin": "2024-05-23",
 *     }
 *
 * @apiError (Error 400) {String} error Données invalides.
 * @apiError (Error 400) {String} error Le parent et l'enfant doivent être des appareils différents.
 * @apiError (Error 400) {String} error L'appareil parent doit être à l'état 'installé' pour être connecté.
 * @apiError (Error 400) {String} error L'appareil enfant doit être à l'état 'installé' pour être connecté.
 * @apiError (Error 400) {String} error La date de début doit être antérieure à la date de fin.
 * @apiError (Error 400) {String} error Les dates se chevauchent pour l'appareil enfant.
 * @apiError (Error 404) {String} error Pas d'appareil trouvé avec l'id parent fourni.
 * @apiError (Error 404) {String} error Pas d'appareil trouvé avec l'id enfant fourni.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

  if (dateDebut > dateFin || connexion.dateDebut > dateFin || connexion.dateFin < dateDebut) {
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

/**
 * @api {delete} /connexions/:id Supprimer une connexion
 * @apiVersion 0.1.0
 * @apiName DeleteConnexion
 * @apiGroup Connexions
 *
 * @apiParam {Number} id ID de la connexion à supprimer.
 *
 * @apiSuccess {String} message Connexion supprimée avec succès.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "message": "Connexion supprimée avec succès"
 *     }
 *
 * @apiError (Error 404) {String} error Connexion non trouvée.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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
