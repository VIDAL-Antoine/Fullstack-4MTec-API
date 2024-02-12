import express from 'express';
import User from '../models/UserModel';
import { postUserSchema } from '../schemas/UserSchema';

const router = express.Router();

/**
 * @api {post} /signup S'inscrire en tant que nouvel utilisateur pour accéder à l'API
 * @apiVersion 0.1.0
 * @apiName SignUpUser
 * @apiGroup Authentification
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
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

export default router;
