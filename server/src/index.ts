import express, { Express, Response, Request } from 'express';
import cors from 'cors';
import type_appareils_routes from './routes/typeAppareils_routes';
import modele_appareils_routes from './routes/modeleAppareils_routes';
import appareils_routes from './routes/appareils_routes';
import connexions_routes from './routes/connexions_routes';
import { port } from './config';
import { initTypeAppareilModel } from './models/typeAppareil';
import { initModeleAppareilModel } from './models/modeleAppareil';
import { initAppareilModel } from './models/appareil';
import { initConnexionModel } from './models/connexion';
import Sequelize from './database';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/type-appareils', type_appareils_routes);
app.use('/modele-appareils', modele_appareils_routes);
app.use('/appareils', appareils_routes);
app.use('/connexions', connexions_routes);

initTypeAppareilModel(Sequelize);
initModeleAppareilModel(Sequelize);
initAppareilModel(Sequelize);
initConnexionModel(Sequelize);
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
