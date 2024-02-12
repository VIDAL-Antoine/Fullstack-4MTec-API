import express, { Request, Response } from 'express';
import User from '../models/UserModel';
import { postUserSchema, putUserSchema } from '../schemas/UserSchema';

const router = express.Router();

/**
 * @api {get} /users Récupérer tous les utilisateurs
 * @apiVersion 0.1.0
 * @apiName GetUsers
 * @apiGroup Utilisateurs
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiSuccess {Object[]} users Liste des utilisateurs.
 * @apiSuccess {Number} id ID de l'utilisateur.
 * @apiSuccess {String} username Nom d'utilisateur.
 * @apiSuccess {String} password Mot de passe (encrypté).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": 1,
 *         "username": "aaa",
 *         "password": "$2b$10$ZuioCZ85HxTo9E6DJpBrZOiYgxVIpQ.H7BJqHGUG5aX1aHmOYbRwW"
 *       },
 *       {
 *         "id": 2,
 *         "username": "bbb",
 *         "password": "$2b$10$XJ8WqBhBBdd.1F0q.lKvw.OvXVAoRkazhj3sl4Rx53QDtUbZCxSUa"
 *       },
 *       ...
 *     ]
 *
 * @apiError (500) {String} error Erreur interne au serveur.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

/**
 * @api {get} /users/:id Récupérer un utilisateur par son ID
 * @apiVersion 0.1.0
 * @apiName GetUserById
 * @apiGroup Utilisateurs
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID de l'utilisateur à récupérer.
 * 
 * @apiSuccess {Number} id ID de l'utilisateur.
 * @apiSuccess {String} username Nom d'utilisateur.
 * @apiSuccess {String} password Mot de passe (encrypté).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "username": "aaa",
 *       "password": "$2b$10$ZuioCZ85HxTo9E6DJpBrZOiYgxVIpQ.H7BJqHGUG5aX1aHmOYbRwW"
 *     },
 *
 * @apiError (Error 404) {String} error User non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.get('/:id', async (req: Request, res: Response) => {
  const idUser = req.params.id;

  try {
    const user = await User.findByPk(idUser);

    if (!user) {
      return res.status(404).json({ error: 'User non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

/**
 * @api {post} /users Créer un nouvel utilisateur
 * @apiVersion 0.1.0
 * @apiName CreateUser
 * @apiGroup Utilisateurs
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiBody {String} username Nom de l'utilisateur à créer.
 * @apiBody {String} password Mot de passe de l'utilisateur à créer.
 * 
 * @apiSuccess {Number} id ID de l'utilisateur créé.
 * @apiSuccess {String} username Nom d'utilisateur créé.
 * @apiSuccess {String} password Mot de passe créé (encrypté).
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 1,
 *       "username": "aaa",
 *       "password": "$2b$10$ZuioCZ85HxTo9E6DJpBrZOiYgxVIpQ.H7BJqHGUG5aX1aHmOYbRwW"
 *     },
 *
 * @apiError (Error 400) {String} error Nom d'utilisateur vide ou déjà pris ou mot de passe vide.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  const { error } = postUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Le nom d\'utilisateur est vide' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ error: 'Le mot de passe est vide' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
    }

    const hashedPassword = await User.hashPassword(password);

    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

/**
 * @api {put} /users/:id Mettre à jour un utilisateur existant
 * @apiVersion 0.1.0
 * @apiName UpdateUser
 * @apiGroup Utilisateurs
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID de l'utilisateur à mettre à jour.
 * @apiBody {String} [username] Nouveau nom de l'utilisateur.
 * @apiBody {String} [password] Nouveau mot de passe de l'utilisateur.
 *
 * @apiSuccess {Number} idModele ID de l'utilisateur mis à jour.
 * @apiSuccess {String} username Nom de l'utilisateur mis à jour.
 * @apiSuccess {String} password Mot de passe de l'utilisateur mis à jour.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "username": "aaa",
 *       "password": "$2b$10$ZuioCZ85HxTo9E6DJpBrZOiYgxVIpQ.H7BJqHGUG5aX1aHmOYbRwW"
 *     },
 *
 * @apiError (Error 404) {String} error User non trouvé.
 * @apiError (Error 409) {String} error Username déjà utilisé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.put('/:id', async (req: Request, res: Response) => {
  const idUser = req.params.id;
  const { username } = req.body;
  let password = req.body.password;

  const { error } = putUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (username) {
    const usernameExistant = await User.findOne({ where: { username }});

    if (usernameExistant) {
      return res.status(409).json({ error: 'Username déjà utilisé' });
    }
  }

  if (password) {
    password = await User.hashPassword(password);
  }

  try {
    const user = await User.findByPk(idUser);

    if (!user) {
      return res.status(404).json({ error: 'User non trouvé' });
    }

    console.log(password);

    await user.update({ username, password });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

/**
 * @api {delete} /users/:id Supprimer un utilisateur
 * @apiVersion 0.1.0
 * @apiName DeleteUser
 * @apiGroup Utilisateurs
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiParam {Number} id ID de l'utilisateur à supprimer.
 *
 * @apiSuccess {String} message User supprimé avec succès.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User supprimé avec succès"
 *     }
 *
 * @apiError (Error 404) {String} error User non trouvé.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const idUser = req.params.id;

  try {
    const user = await User.findByPk(idUser);

    if (!user) {
      return res.status(404).json({ error: 'User non trouvé' });
    }

    await user.destroy();
    res.json({ message: 'User supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne au serveur' });
  }
});

export default router;
