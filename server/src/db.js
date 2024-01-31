import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    database: 'appareils_4mtec',
    username: 'postgres',
    password: 'aaa',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});

export default sequelize;