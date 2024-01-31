import { DataTypes, Model } from 'sequelize';
import sequelize from './db.js';

class Type_appareil extends Model {}

Type_appareil.init({
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Type_appareil',
    tableName: 'type_appareils',
    timestamps: false,
});

export default Type_appareil;