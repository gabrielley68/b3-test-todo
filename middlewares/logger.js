const fs = require('fs');
const path = require('path');

// Middleware permettant de logger toutes les requêtes HTTP
function logger(req, res, next){
    const now = new Date(Date.now());

    const logDate = now.toISOString().split('T')[0];

    const logFile = path.join(process.env.LOGS_DIR, `${logDate}.log`);

    const method = req.method;
    const url = req.originalUrl;

    res.on('finish', () => {
        const statusCode = res.statusCode;

        const logEntry = `${method} ${statusCode} ${url} ${now.toString()}\n`;

        fs.mkdir(path.dirname(logFile), {recursive: true}, (dirError) => {

            if(dirError){
                console.error("Couldn't create log directory", dirError);
            } else {
                fs.appendFile(logFile, logEntry, (fileError) => {
                    if(fileError){
                        console.error("Couldn't write in log file", fileError);
                    }
                });
            }
        });
    });

    next();
};

module.exports = logger;