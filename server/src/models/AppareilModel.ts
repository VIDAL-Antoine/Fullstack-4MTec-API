import { DataTypes, Model, Sequelize } from 'sequelize';
import ModeleAppareil from './ModeleAppareilModel';

class Appareil extends Model {
  public idAppareil!: number;
  public idModeleAppareil!: number;
  public adresseMAC!: string;
  public etat!: string;
}

export const initAppareilModel = (sequelize: Sequelize) => {
  Appareil.init(
    {
      idAppareil: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_appareil',
      },
      idModeleAppareil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_modele_appareil',
      },
      adresseMAC: {
        type: DataTypes.MACADDR,
        allowNull: false,
        unique: true,
        field: 'adresse_mac',
      },
      etat: {
        type: DataTypes.ENUM('stock', 'installé', 'maintenance'),
        allowNull: false,
        defaultValue: 'stock',
        field: 'etat',
      },
    },
    {
      sequelize,
      tableName: 'appareils',
      paranoid: true,
    }
  );

  Appareil.belongsTo(ModeleAppareil, {
    foreignKey: 'idModeleAppareil',
    targetKey: 'idModele',
    as: 'modele',
  });
};

export default Appareil;
