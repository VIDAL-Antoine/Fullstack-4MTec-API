import express, { Request, Response } from 'express';
import Appareil from '../models/AppareilModel';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';
import { Op } from 'sequelize';
import { postAppareilSchema, putAppareilSchema } from '../schemas/AppareilSchema';

const router = express.Router();

/**
 * @api {get} /appareils Récupérer tous les appareils
 * @apiVersion 0.1.0
 * @apiName GetAppareils
 * @apiGroup Appareils
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {String} [adresseMAC] Adresse MAC de l'appareil.
 * @apiParam {String="stock", "installé", "maintenance"} [etat] État de l'appareil.
 * @apiParam {String} [nomModele] Nom du modèle de l'appareil.
 * @apiParam {String} [nomType] Nom du type de l'appareil.
 * @apiParam {Number} [idModeleAppareil] ID du modèle de l'appareil.
 * @apiParam {Number} [idTypeAppareil] ID du type de l'appareil.
 *
 * @apiSuccess {Object[]} appareils Liste des appareils.
 * @apiSuccess {Number} appareils.idAppareil ID de l'appareil.
 * @apiSuccess {Number} appareils.idModeleAppareil ID du modèle de l'appareil.
 * @apiSuccess {String} appareils.adresseMAC Adresse MAC de l'appareil.
 * @apiSuccess {String} appareils.etat État de l'appareil.
 * @apiSuccess {Object} appareils.modele Informations sur le modèle de l'appareil.
 * @apiSuccess {Number} appareils.modele.idModele ID du modèle de l'appareil.
 * @apiSuccess {String} appareils.modele.nomModele Nom du modèle de l'appareil.
 * @apiSuccess {Number} appareils.modele.idTypeAppareil ID du type de l'appareil.
 * @apiSuccess {Object} appareils.modele.type Informations sur le type de l'appareil.
 * @apiSuccess {Number} appareils.modele.type.idType ID du type de l'appareil.
 * @apiSuccess {String} appareils.modele.type.nomType Nom du type de l'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *         "idAppareil": 1,
 *         "idModeleAppareil": 1,
 *         "adresseMAC": "11:22:33:44:55:66",
 *         "etat": "installé",
 *         "modele": {
 *             "idModele": 1,
 *             "nomModele": "Box OCP",
 *             "idTypeAppareil": 1,
 *             "type": {
 *                 "idType": 1,
 *                 "nomType": "Box"
 *             }
 *         }
 *     },
 *     {
 *         "idAppareil": 4,
 *         "idModeleAppareil": 4,
 *         "adresseMAC": "11:22:33:44:55:99",
 *         "etat": "maintenance",
 *         "modele": {
 *             "idModele": 4,
 *             "nomModele": "Chaudière OCP Capri",
 *             "idTypeAppareil": 3,
 *             "type": {
 *                 "idType": 3,
 *                 "nomType": "Chaudière"
 *             }
 *         }
 *     },
 *     ]
 * @apiError (Error 500) {Object} error Erreur interne au serveur.
 */
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

/**
 * @api {get} /appareils/:id Récupérer un appareil par son ID
 * @apiVersion 0.1.0
 * @apiName GetAppareilById
 * @apiGroup Appareils
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID de l'appareil.
 *
 * @apiSuccess {Object} appareil Informations sur l'appareil.
 * @apiSuccess {Number} appareil.idAppareil ID de l'appareil.
 * @apiSuccess {Number} appareil.idModeleAppareil ID du modèle de l'appareil.
 * @apiSuccess {String} appareil.adresseMAC Adresse MAC de l'appareil.
 * @apiSuccess {String} appareil.etat État de l'appareil.
 * @apiSuccess {Object} appareil.modele Informations sur le modèle de l'appareil.
 * @apiSuccess {Number} appareil.modele.idModele ID du modèle de l'appareil.
 * @apiSuccess {String} appareil.modele.nomModele Nom du modèle de l'appareil.
 * @apiSuccess {Number} appareil.modele.idTypeAppareil ID du type de l'appareil.
 * @apiSuccess {Object} appareil.modele.type Informations sur le type de l'appareil.
 * @apiSuccess {Number} appareil.modele.type.idType ID du type de l'appareil.
 * @apiSuccess {String} appareil.modele.type.nomType Nom du type de l'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "idAppareil": 1,
 *         "idModeleAppareil": 1,
 *         "adresseMAC": "11:22:33:44:55:66",
 *         "etat": "installé",
 *         "modele": {
 *             "idModele": 1,
 *             "nomModele": "Box OCP",
 *             "idTypeAppareil": 1,
 *             "type": {
 *                 "idType": 1,
 *                 "nomType": "Box"
 *             }
 *         }
 *     }
 *
 * @apiError (Error 404) {Object} error Appareil non trouvé.
 * @apiError (Error 500) {Object} error Erreur interne au serveur.
 */
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

/**
 * @api {post} /appareils Créer un nouvel appareil
 * @apiVersion 0.1.0
 * @apiName CreateAppareil
 * @apiGroup Appareils
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiBody {String} adresseMAC Adresse MAC de l'appareil. Unique pour chaque appareil. Doit être sous la forme XX:XX:XX:XX:XX:XX (avec X entre 0 et F).
 * @apiBody {Number} idModeleAppareil ID du modèle de l'appareil.
 * @apiBody {String="stock", "installé", "maintenance"} etat="stock" Nouvel état de l'appareil (par défaut à "stock").
 *
 * @apiSuccess {Number} idAppareil ID de l'appareil créé.
 * @apiSuccess {String} adresseMAC Adresse MAC de l'appareil créé.
 * @apiSuccess {Number} idModeleAppareil ID du modèle de l'appareil créé.
 * @apiSuccess {String} etat État de l'appareil créé.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *         "idAppareil": 8,
 *         "adresseMAC": "55:55:55:55:55:55"
 *         "idModeleAppareil": 5,
 *         "etat": "stock",
 *     }
 *
 * @apiError (Error 400) {String} error Données invalides.
 * @apiError (Error 404) {String} error ID Modèle non trouvé.
 * @apiError (Error 409) {String} error Adresse MAC déjà utilisée.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {put} /appareils/:id Mettre à jour un appareil
 * @apiVersion 0.1.0
 * @apiName UpdateAppareil
 * @apiGroup Appareils
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID de l'appareil à mettre à jour.
 * @apiBody {String} [adresseMAC] Nouvelle adresse MAC de l'appareil. Unique pour chaque appareil.
 * @apiBody {Number} [idModeleAppareil] Nouvel ID du modèle de l'appareil.
 * @apiBody {String="stock", "installé", "maintenance"} [etat] Nouvel état de l'appareil.
 *
 * @apiSuccess {Number} idAppareil ID de l'appareil mis à jour.
 * @apiSuccess {String} adresseMAC Adresse MAC de l'appareil mise à jour.
 * @apiSuccess {Number} idModeleAppareil ID du modèle de l'appareil mis à jour.
 * @apiSuccess {String} etat État de l'appareil mis à jour.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "idAppareil": 8,
 *         "adresseMAC": "55:55:55:55:55:55"
 *         "idModeleAppareil": 5,
 *         "etat": "stock",
 *     }
 *
 * @apiError (Error 400) {String} error Données invalides.
 * @apiError (Error 404) {String} error ID Modèle non trouvé.
 * @apiError (Error 404) {String} error Appareil non trouvé.
 * @apiError (Error 409) {String} error Adresse MAC déjà utilisée.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {delete} /appareils/:id Supprimer un appareil
 * @apiVersion 0.1.0
 * @apiName DeleteAppareil
 * @apiGroup Appareils
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID de l'appareil à supprimer.
 *
 * @apiSuccess {String} message Appareil supprimé avec succès.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "message": "Appareil supprimé avec succès"
 *     }
 *
 * @apiError (Error 404) {String} error Appareil non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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
