const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const errorMiddleware = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');

require('dotenv').config();

const app = express();

app.use(helmet()); 
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/loans', require('./routes/loanRoutes'));
app.use('/api/v1/transactions', require('./routes/transactionRoutes'));
app.use('/api/v1/stats', require('./routes/statsRoutes'));

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server glowing on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
});