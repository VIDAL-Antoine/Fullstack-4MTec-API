import { DataTypes, DateOnlyDataType, Model, RangeDataType, Sequelize } from 'sequelize';
import Appareil from './appareil';

class Connexion extends Model {
  public id_connexion!: number;
  public id_appareil_parent!: number;
  public id_appareil_enfant!: number;
  public mac_address_parent!: string;
  public mac_address_enfant!: string;
  public datedebut!: DateOnlyDataType;
  public datefin?: DateOnlyDataType;
}

export const initConnexionModel = (sequelize: Sequelize) => {
  Connexion.init(
    {
      id_connexion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_appareil_parent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_appareil_enfant: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mac_address_parent: {
        type: DataTypes.STRING(17),
        allowNull: false,
      },
      mac_address_enfant: {
        type: DataTypes.STRING(17),
        allowNull: false,
      },
      datedebut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      datefin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'connexions',
    }
  );

  Connexion.belongsTo(Appareil, {
    foreignKey: 'id_appareil_parent',
    targetKey: 'id_appareil',
    as: 'appareilParent',
  });

  Connexion.belongsTo(Appareil, {
    foreignKey: 'id_appareil_enfant',
    targetKey: 'id_appareil',
    as: 'appareilEnfant',
  });
};

export default Connexion;
