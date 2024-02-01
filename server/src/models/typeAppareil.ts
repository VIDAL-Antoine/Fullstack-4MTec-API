import { DataTypes, Model, Sequelize } from 'sequelize';

class TypeAppareil extends Model {
  public id!: number;
  public nom!: string;
}

export const initTypeAppareilModel = (sequelize: Sequelize) => {
  TypeAppareil.init(
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
    },
    {
      sequelize,
      tableName: 'type_appareils',
    }
  );
};

export default TypeAppareil;
