import { DataTypes, Model } from 'sequelize';
import sequelize from './db.js';
import Type_appareil from './type_appareil.js';

class Modele_appareil extends Model {}

Modele_appareil.init({
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type_appareil_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Type_appareil,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Modele_appareil',
    tableName: 'modele_appareils',
    timestamps: false,
});

export default Modele_appareil;
