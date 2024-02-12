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

/**
 * @api {get} /type-appareils Récupérer tous les types d'appareils
 * @apiVersion 0.1.0
 * @apiName GetTypesAppareils
 * @apiGroup TypeAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {String} [nomType] Nom du type d'appareil à filtrer. 
 *
 * @apiSuccess {Object[]} types Liste des types d'appareils.
 * @apiSuccess {Number} idType ID du type d'appareil.
 * @apiSuccess {String} nomType Nom du type d'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "idType": 1,
 *         "nomType": "Box"
 *       },
 *       {
 *         "idType": 2,
 *         "nomType": "Radiateur"
 *       }
 *     ]
 *
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {get} /type-appareils/:id Récupérer un type d'appareil par son ID
 * @apiVersion 0.1.0
 * @apiName GetTypeAppareilById
 * @apiGroup TypeAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID du type d'appareil à récupérer.
 * 
 * @apiSuccess {Number} idType ID du type d'appareil.
 * @apiSuccess {String} nomType Nom du type d'appareil.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "idType": 1,
 *       "nomType": "Box"
 *     }
 *
 * @apiError (Error 404) {String} error Type non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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

/**
 * @api {post} /type-appareils Créer un nouveau type d'appareil
 * @apiVersion 0.1.0
 * @apiName CreateTypeAppareil
 * @apiGroup TypeAppareil
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiBody {String} nomType Nom du type d'appareil à créer.
 *
 * @apiSuccess {Number} idType ID du type d'appareil créé.
 * @apiSuccess {String} nomType Nom du type d'appareil créé.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "idType": 1,
 *       "nomType": "Box"
 *     }
 *
 * @apiError (Error 409) {String} error Nom de type déjà utilisé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', validateTypeAppareil, async (req: Request, res: Response) => {
  const { nomType } = req.body;

  const typeExistant = await TypeAppareil.findOne({ where: { nomType }});

  if (typeExistant) {
    return res.status(409).json({ error: 'Nom de type déjà utilisé' });
  }

  try {
    const nouveauType = await TypeAppareil.create({ nomType });
    res.status(201).json(nouveauType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

/**
 * @api {put} /type-appareils/:id Mettre à jour un type d'appareil existant
 * @apiVersion 0.1.0
 * @apiName UpdateTypeAppareil
 * @apiGroup TypeAppareil
 * *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID du type d'appareil à mettre à jour.
 * @apiBody {String} [nomType] Nouveau nom du type d'appareil.
 *
 * @apiSuccess {Number} idType ID du type d'appareil mis à jour.
 * @apiSuccess {String} nomType Nom du type d'appareil mis à jour.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "idType": 1,
 *       "nomType": "Box"
 *     }
 *
 * @apiError (Error 404) {String} error Type non trouvé.
 * @apiError (Error 409) {String} error Nom de type déjà utilisé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.put('/:id', validateTypeAppareil, async (req: Request, res: Response) => {
  const idType = req.params.id;
  const { nomType } = req.body;

  const typeExistant = await TypeAppareil.findOne({ where: { nomType }});

  if (typeExistant) {
    return res.status(409).json({ error: 'Nom de type déjà utilisé' });
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

/**
 * @api {delete} /type-appareils/:id Supprimer un type d'appareil
 * @apiVersion 0.1.0
 * @apiName DeleteTypeAppareil
 * @apiGroup TypeAppareil
 * *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID du type d'appareil à supprimer.
 *
 * @apiSuccess {String} message Type supprimé avec succès.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Type supprimé avec succès"
 *     }
 *
 * @apiError (Error 404) {String} error Type non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
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
