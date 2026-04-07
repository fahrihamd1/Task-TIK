import { Knex } from 'knex';
// sesuaikan config dengan database yang dibuat diawal
const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '12345678910',
        database: 'postgres',
    },
};
export default config;