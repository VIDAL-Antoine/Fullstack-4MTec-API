import { DataTypes, DateOnlyDataType, Model, Sequelize } from 'sequelize';
import Appareil from './AppareilModel';

class Connexion extends Model {
  public idConnexion!: number;
  public idAppareilParent!: number;
  public idAppareilEnfant!: number;
  public dateDebut!: DateOnlyDataType;
  public dateFin!: DateOnlyDataType;
}

export const initConnexionModel = (sequelize: Sequelize) => {
  Connexion.init(
    {
      idConnexion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_connexion'
      },
      idAppareilParent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_appareil_parent',
        validate: {
          connexionSurMemeAppareil(idAppareilParent: number) {
            if (idAppareilParent === this.idAppareilEnfant) {
              throw new Error('Un appareil ne peut se connecter à lui-même');
            }
          }
        }
      },
      idAppareilEnfant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_appareil_enfant',
        validate: {
          connexionSurMemeAppareil(idAppareilEnfant: number) {
            if (idAppareilEnfant === this.idAppareilParent) {
              throw new Error('Un appareil ne peut se connecter à lui-même');
            }
          }
        }
      },
      dateDebut: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'date_debut'
      },
      dateFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'date_fin'
      },
    },
    {
      sequelize,
      tableName: 'connexions',
      paranoid: true,
    }
  );

  Connexion.belongsTo(Appareil, {
    foreignKey: 'idAppareilParent',
    targetKey: 'idAppareil',
    as: 'appareilParent',
  });

  Connexion.belongsTo(Appareil, {
    foreignKey: 'idAppareilEnfant',
    targetKey: 'idAppareil',
    as: 'appareilEnfant',
  });
};

export default Connexion;
