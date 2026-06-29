const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.error('ERROR', err);

    // Sanitize MongoDB duplicate key errors — never expose collection/index names to client
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        const fieldMessages = {
            phone: 'Namba hii ya simu tayari imesajiliwa.',
            groupCode: 'Code hii ya kikundi tayari imetumika. Tafadhali chagua nyingine.',
        };
        return res.status(400).json({
            status: 'fail',
            message: fieldMessages[field] || 'Rekodi hii tayari ipo. Tafadhali badilisha na ujaribu tena.',
        });
    }

    // Sanitize Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: 'Ombi batili.' });
    }

    // Never expose stack traces to the client
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};