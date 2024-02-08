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
