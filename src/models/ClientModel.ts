// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../common/database/SQL_DB_CONN';
import { IClient } from '../common/interfaces/IClient';

interface ClientCreationAttributes extends Optional<IClient, 'id'> { }

class Client extends Model<IClient, ClientCreationAttributes> implements IClient {

    public id!: number;
    public name!: string;
    public Roc!: string;
    public companyStatus!: string;
    public companyActivity!: string;
    public registrationDate!: string;
    public category!: string;
    public subCategory!: string;
    public companyClass!: string;
    public state!: string;
    public country!: string;
    public email!: string;
    public cin!: string;
    public pin!: string;
    public address!: string;
    public link!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Client.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    Roc: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    companyStatus: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    companyActivity: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    registrationDate: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    category: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    subCategory: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    companyClass: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    state: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    country: {
        type: new DataTypes.STRING(128),
        allowNull: true
    },
    email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    cin: {
        type: new DataTypes.STRING(21),
        allowNull: false
    },
    pin: {
        type: new DataTypes.STRING(6),
        allowNull: false
    },
    address: {
        type: new DataTypes.STRING(256),
        allowNull: true
    },
    link: {
        type: new DataTypes.STRING(256),
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'clients',
});

Client.sync({ alter: true });

export default Client;