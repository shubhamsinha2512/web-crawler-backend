import { Sequelize } from 'sequelize';
import { SQL_DATABASE, SQL_PASSWORD, SQL_USERNAME } from '../configs/configs';

const sequelize = new Sequelize({
    host: SQL_DATABASE,
    username: SQL_USERNAME,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    dialect: 'mysql'
})

export default sequelize;