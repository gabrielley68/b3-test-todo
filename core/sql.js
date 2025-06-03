// Configuration de MySQL
const mysql = require('mysql2');

const pool = mysql.createPool({
    'host': 'localhost',
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME,
});


// Déclaration d'une méthode générique de requête SQL basée sur des Promise
// (à utiliser avec async/await)
function sqlQuery(query){
    return new Promise((resolve, reject) => {
        pool.getConnection((connectionError, connection) => {
            if(connectionError){
                reject(connectionError);
                return;
            }

            connection.query(query, (queryError, results) => {
                if(queryError){
                    reject(queryError);
                } else {
                    resolve(results)
                }
                connection.release();
            });
        });
    });
}

module.exports = {
    query: sqlQuery,
}