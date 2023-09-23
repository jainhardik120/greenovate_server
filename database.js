const {Pool} = require("pg");

const postURL = process.env.POSTGRES_URL;

const pool = new Pool({
    // user : "postgres",
    // password : "********",
    // host : "localhost",
    // port : 5432,
    // database : "greenovate"
    connectionString: postURL + "?sslmode=require",
});

module.exports = pool;