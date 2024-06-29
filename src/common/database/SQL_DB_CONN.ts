import { Sequelize } from 'sequelize';
import { SQL_DATABASE, SQL_HOST, SQL_PASSWORD, SQL_USERNAME } from '../configs/configs';

const sequelize = new Sequelize(SQL_DATABASE, SQL_USERNAME, SQL_PASSWORD, {
    host: SQL_HOST,
    dialect: 'mysql'
})

try {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    });
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;