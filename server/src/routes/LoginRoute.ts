import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { jwt_secret_key } from '../config';
import { postUserSchema } from '../schemas/UserSchema';

const router = express.Router();

/**
 * @api {post} /login Se connecter à l'API pour pouvoir l'utiliser
 * @apiVersion 0.1.0
 * @apiName LoginUser
 * @apiGroup Authentification
 *
 * @apiBody {String} username Nom de l'utilisateur.
 * @apiBody {String} password Mot de passe.
 * 
 * @apiSuccess {String} Token JWT pour pouvoir s'authentifier sur l'API.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3MDc2Nzk5MTEsImV4cCI6MTcwNzY4MzUxMX0.37Da4NnlggLKv4bO03uAuO2kHk6rpgqg5Y33dut23k0"
 *     }
 *
 * @apiError (Error 401) {String} error Nom d'utilisateur ou mot de passe incorrect.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  const { error } = postUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Le username n'existe pas" });
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user.id }, jwt_secret_key, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

export default router;
