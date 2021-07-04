import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
// import cors from 'cors';

const NAMESPACE: string = 'Server';
const router = express();

/** Log the request */
router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes go here */

import AuthRoutes from './routes/_auth.router';
router.use('/auth', AuthRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

//Mongo
const mongoUserName = process.env.MONGO_UserName || 'nafeojoy';
const mongoPassword = process.env.MONGO_Password || '1234';
const mongoDbName = process.env.MONGO_DbName || 'tuliptech';
const CONNECTION_URL = `mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0.lq4xh.gcp.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`; //Mongo Connection

const PORT = process.env.PORT || 5000;

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => router.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
