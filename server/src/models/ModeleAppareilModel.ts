import { DataTypes, Model, Sequelize } from 'sequelize';
import TypeAppareil from './TypeAppareilModel';

class ModeleAppareil extends Model {
  public idModele!: number;
  public nomModele!: string;
  public idTypeAppareil!: number;
}

export const initModeleAppareilModel = (sequelize: Sequelize) => {
    ModeleAppareil.init(
    {
      idModele: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_modele'
      },
      nomModele: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'nom_modele'
      },
      idTypeAppareil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_type_appareil'
      },
    },
    {
      sequelize,
      tableName: 'modele_appareils',
      paranoid: true,
    }
  );

  ModeleAppareil.belongsTo(TypeAppareil, {
    foreignKey: 'idTypeAppareil',
    targetKey: 'idType',
    as: 'type',
  });
};

export default ModeleAppareil;
