import express, { Request, Response } from 'express';
import ModeleAppareil from '../models/ModeleAppareilModel';
import TypeAppareil from '../models/TypeAppareilModel';
import { postModeleAppareilSchema, putModeleAppareilSchema } from '../schemas/ModeleAppareilSchema';

const router = express.Router();

/**
 * @api {get} /modele-appareils Récupérer tous les modèles d'appareils
 * @apiVersion 0.1.0
 * @apiName GetModelesAppareils
 * @apiGroup ModeleAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {String} [nomModele] Nom du modèle d'appareil à filtrer.
 * @apiParam {String} [nomType] Nom du type d'appareil associé au modèle.
 * @apiParam {Number} [idTypeAppareil] ID du type d'appareil associé au modèle.
 *
 * @apiSuccess {Object[]} modeles Liste des modèles d'appareils.
 * @apiSuccess {Number} idModele ID du modèle d'appareil.
 * @apiSuccess {String} nomModele Nom du modèle d'appareil.
 * @apiSuccess {Object} type Informations sur le type d'appareil associé.
 * @apiSuccess {Number} type.idType ID du type d'appareil.
 * @apiSuccess {String} type.nomType Nom du type d'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "idModele": 1,
 *         "nomModele": "Box OCP",
 *         "idTypeAppareil": 1,
 *         "type": {
 *           "idType": 1,
 *           "nomType": "Box"
 *         }
 *       },
 *       {
 *         "idModele": 2,
 *         "nomModele": "Radiateur 1700X",
 *         "idTypeAppareil": 2, 
 *         "type": {
 *           "idType": 2,
 *           "nomType": "Radiateur"
 *         }
 *       }
 *     ]
 *
 * @apiError (500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {get} /modele-appareils/:id Récupérer un modèle d'appareil par son ID
 * @apiVersion 0.1.0
 * @apiName GetModeleAppareilById
 * @apiGroup ModeleAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID du modèle d'appareil à récupérer.
 *
 * @apiSuccess {Number} idModele ID du modèle d'appareil.
 * @apiSuccess {String} nomModele Nom du modèle d'appareil.
 * @apiSuccess {Object} type Informations sur le type d'appareil associé.
 * @apiSuccess {Number} type.idType ID du type d'appareil.
 * @apiSuccess {String} type.nomType Nom du type d'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "idModele": 1,
 *       "nomModele": "Box OCP",
 *       "idTypeAppareil": 1,
 *       "type": {
 *         "idType": 1,
 *         "nomType": "Box"
 *       }
 *     }
 *
 * @apiError (Error 404) {String} error Modèle non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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


/**
 * @api {post} /modele-appareils Créer un nouveau modèle d'appareil
 * @apiVersion 0.1.0
 * @apiName CreateModeleAppareil
 * @apiGroup ModeleAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiBody {String} nomModele Nom du modèle d'appareil à créer.
 * @apiBody {Number} idTypeAppareil ID du type d'appareil associé au modèle.
 * 
 * @apiSuccess {Number} idModele ID du modèle d'appareil créé.
 * @apiSuccess {String} nomModele Nom du modèle d'appareil créé.
 * @apiSuccess {Number} idTypeAppareil ID du type d'appareil associé au modèle créé.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "idModele": 1,
 *       "nomModele": "Box OCP",
 *       "idTypeAppareil": 1
 *     }
 *
 * @apiError (Error 404) {String} error ID Type non trouvé.
 * @apiError (Error 409) {String} error Nom de modèle déjà utilisé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', async (req: Request, res: Response) => {
  const { nomModele, idTypeAppareil } = req.body;
  
  const { error } = postModeleAppareilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const modeleExistant = await ModeleAppareil.findOne({ where: { nomModele }});

  if (modeleExistant) {
    return res.status(409).json({ error: 'Nom de modèle déjà utilisé' });
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

/**
 * @api {put} /modele-appareils/:id Mettre à jour un modèle d'appareil existant
 * @apiVersion 0.1.0
 * @apiName UpdateModeleAppareil
 * @apiGroup ModeleAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID du modèle d'appareil à mettre à jour.
 * @apiBody {String} [nomModele] Nouveau nom du modèle d'appareil.
 * @apiBody {Number} [idTypeAppareil] Nouvel ID du type d'appareil associé au modèle.
 *
 * @apiSuccess {Number} idModele ID du modèle d'appareil mis à jour.
 * @apiSuccess {String} nomModele Nom du modèle d'appareil mis à jour.
 * @apiSuccess {Number} idTypeAppareil ID du type d'appareil associé au modèle mis à jour.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "idModele": 1,
 *       "nomModele": "Box OCP",
 *       "idTypeAppareil": 1
 *     }
 *
 * @apiError (Error 404) {String} error Modèle non trouvé.
 * @apiError (Error 404) {String} error ID Type non trouvé.
 * @apiError (Error 409) {String} error Nom de modèle déjà utilisé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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
      return res.status(409).json({ error: 'Nom de modèle déjà utilisé' });
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

/**
 * @api {delete} /modele-appareils/:id Supprimer un modèle d'appareil
 * @apiVersion 0.1.0
 * @apiName DeleteModeleAppareil
 * @apiGroup ModeleAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 *
 * @apiParam {Number} id ID du modèle d'appareil à supprimer.
 *
 * @apiSuccess {String} message Modèle supprimé avec succès.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Modele supprimé avec succès"
 *     }
 *
 * @apiError (Error 404) {String} error Modèle non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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
