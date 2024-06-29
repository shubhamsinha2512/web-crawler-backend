// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../common/database/SQL_DB_CONN';

import { IClient } from '../common/interfaces/IClient';

interface ClientCreationAttributes extends Optional<IClient, 'id'> { }

class Client extends Model<IClient, ClientCreationAttributes> implements IClient {
    public id!: number;
    public name!: string;
    public email!: string;
    public cin!: string;
    public pin!: string;
    public address!: string;

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
    }
}, {
    sequelize,
    tableName: 'clients'
});

Client.sync({ alter: true });

export default Client;