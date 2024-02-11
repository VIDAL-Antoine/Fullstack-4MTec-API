import express, { Express } from 'express';
import cors from 'cors';
import type_appareils_routes from './routes/TypeAppareilRoutes';
import modele_appareils_routes from './routes/ModeleAppareilRoutes';
import appareils_routes from './routes/AppareilRoutes';
import connexions_routes from './routes/ConnexionRoutes';
import { port } from './config';
import { initTypeAppareilModel } from './models/TypeAppareilModel';
import { initModeleAppareilModel } from './models/ModeleAppareilModel';
import { initAppareilModel } from './models/AppareilModel';
import { initConnexionModel } from './models/ConnexionModel';
import Sequelize from './database';
import { verifyToken } from './middlewares/verifyToken';
import { initUserModel } from './models/UserModel';
import login_route from './routes/LoginRoute';
import sign_up_route from './routes/SignUpRoute';
import users_routes from './routes/UserRoutes';
import revoke_token_route from './routes/RevokeTokenRoute';

const app: Express = express();
app.use(cors());
app.use(express.json());

initUserModel(Sequelize);
app.use('/signup', sign_up_route);
app.use('/login', login_route);
app.use(verifyToken);

app.use('/revoke-token', revoke_token_route);
app.use('/type-appareils', type_appareils_routes);
app.use('/modele-appareils', modele_appareils_routes);
app.use('/appareils', appareils_routes);
app.use('/connexions', connexions_routes);
app.use('/users', users_routes);

initTypeAppareilModel(Sequelize);
initModeleAppareilModel(Sequelize);
initAppareilModel(Sequelize);
initConnexionModel(Sequelize);
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
