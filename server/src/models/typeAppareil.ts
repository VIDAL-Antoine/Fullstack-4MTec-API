import { DataTypes, Model, Sequelize } from 'sequelize';

class TypeAppareil extends Model {
  public id!: number;
  public nomType!: string;
}

export const initTypeAppareilModel = (sequelize: Sequelize) => {
  TypeAppareil.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nomType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'type_appareils',
      paranoid: true,
    }
  );
};

export default TypeAppareil;
