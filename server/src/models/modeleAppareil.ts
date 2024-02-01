import { DataTypes, Model, Sequelize } from 'sequelize';
import TypeAppareil from './typeAppareil';

class ModeleAppareil extends Model {
  public id!: number;
  public nom!: string;
  public type_appareil_id!: number;
}

export const initModeleAppareilModel = (sequelize: Sequelize) => {
    ModeleAppareil.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type_appareil_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'modele_appareils',
    }
  );

  ModeleAppareil.belongsTo(TypeAppareil, {
    foreignKey: 'type_appareil_id',
    targetKey: 'id',
    as: 'type',
  });
};

export default ModeleAppareil;
