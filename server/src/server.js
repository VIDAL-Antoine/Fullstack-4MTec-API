import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type_appareils_routes from './type_appareils_routes.js';
import modele_appareils_routes from './modele_appareils_routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/type_appareils', type_appareils_routes);
app.use('/modele_appareils', modele_appareils_routes);

const PORT = process.env.NODE_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
