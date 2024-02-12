import express from 'express';
import { revokeToken } from '../utils/TokenUtils';

const router = express.Router();

/**
 * @api {post} /revoke-token Révoquer l'accès à l'API en bloquant le token
 * @apiVersion 0.1.0
 * @apiName RevokeToken
 * @apiGroup Authentification
 *
 * @apiHeader Authorization Bearer 'token JWT'. Token nécessaire à l'authentification.
 * 
 * @apiBody {String} token Le token JWT à révoquer.
 * 
 * @apiSuccess {String} message Token révoqué avec succès.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Token révoqué avec succès"
 *     }
 *
 * @apiError (Error 400) {String} error Token non fourni.
 * @apiError (Error 500) {String} error Erreur interne au serveur.
 */
router.post('/', (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(400).json({ error: 'Token non fourni' });
    }
    revokeToken(token);
    return res.status(200).json({ message: 'Token révoqué avec succès' });
  } catch (error) {
    console.error('Erreur lors de la révocation du token :', error);
    res.status(500).json({ error: 'Erreur lors de la révocation du token' });
  }
});

export default router;
