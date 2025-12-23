// middlewares/requestLogger.js

const requestLogger = (req, res, next) => {
    console.log(`\n--- Incoming Request ---`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log(`Params:`, req.params);
    console.log(`Query:`, req.query);
    console.log(`Body:`, req.body);
    console.log(`------------------------\n`);
    next();
};

module.exports = requestLogger;
