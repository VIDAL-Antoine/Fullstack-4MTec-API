import { DataTypes, Model, Sequelize } from 'sequelize';
import ModeleAppareil from './modeleAppareil';

class Appareil extends Model {
  public id_appareil!: number;
  public id_modele!: number;
  public mac_address!: string;
  public etat!: string;
}

export const initAppareilModel = (sequelize: Sequelize) => {
  Appareil.init(
    {
      id_appareil: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_modele: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mac_address: {
        type: DataTypes.STRING(17),
        allowNull: false,
        unique: true,
      },
      etat: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'stock',
        validate: {
          isIn: [['stock', 'installé', 'maintenance']],
        },
      },
    },
    {
      sequelize,
      tableName: 'appareils',
    }
  );

  Appareil.belongsTo(ModeleAppareil, {
    foreignKey: 'id_modele',
    targetKey: 'id',
    as: 'modele',
  });
};

export default Appareil;
