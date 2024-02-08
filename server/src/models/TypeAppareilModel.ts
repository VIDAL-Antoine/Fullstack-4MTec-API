import { DataTypes, Model, Sequelize } from 'sequelize';

class TypeAppareil extends Model {
  public idType!: number;
  public nomType!: string;
}

export const initTypeAppareilModel = (sequelize: Sequelize) => {
  TypeAppareil.init(
    {
      idType: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_type'
      },
      nomType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'nom_type'
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
