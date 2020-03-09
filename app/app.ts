#!/usr/bin/env node

import express from 'express';
import session from 'express-session';
// import ejwt from 'express-jwt';
import http from 'http';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import debugFn from 'debug';
import dotenv from 'dotenv';

import Database from '../db/database';
import AppServer from './base/app-server';

const debug = debugFn('my-server:server');
dotenv.config();

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string | number) {
    const numericPort = parseInt(val as string, 10);

    if (Number.isNaN(numericPort)) {
        // named pipe
        return val;
    }

    if (numericPort >= 0) {
        // port number
        return numericPort;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(_error: any, _port: any): void {
    if (_error.syscall !== 'listen') {
        throw _error;
    }

    const bind = typeof _port === 'string' ? `Pipe ${_port}` : `Port ${_port}`;

    // handle specific listen errors with friendly messages
    switch (_error.code) {
        case 'EACCES':
            throw new Error(`${bind} requires elevated privileges`);
        case 'EADDRINUSE':
            throw new Error(`${bind} is already in use`);
        default:
            throw _error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(_server: http.Server): void {
    const addr = _server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

function registerMiddleware(appServer: AppServer): void {
    appServer.ExpressApp.use(logger('dev'));
    appServer.ExpressApp.use(express.json());
    appServer.ExpressApp.use(express.urlencoded({ extended: false }));
    appServer.ExpressApp.use(cookieParser());
    appServer.ExpressApp.use(
        session({
            secret: process.env.APP_SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
        }),
    );
    appServer.ExpressApp.use(appServer.Authenticator.initialize());
    appServer.ExpressApp.use(appServer.Authenticator.session());
    // appServer.ExpressApp.use(ejwt({ secret: process.env.APP_JWT_SECRET })
    //     .unless({ path: appServer.Config.auth.allowedPaths }));
}

(async () => {
    const appServer: AppServer = await AppServer.GetInstance(await Database.GetInstance());

    registerMiddleware(appServer);

    await appServer.RegisterRoutesAndAuth();

    // Get port from environment and store in Express.
    const port = normalizePort(appServer.Config.port);
    appServer.ExpressApp.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(appServer.ExpressApp);

    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', err => onError(err, port));
    server.on('listening', () => onListening(server));
})();
