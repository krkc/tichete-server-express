#!/usr/bin/env node

import express from "express";
import session from "express-session";
import http from "http";
import logger from "morgan";
import cookieParser from "cookie-parser";
import debugFn from "debug";
const debug = debugFn('my-server:server')
import dotenv from "dotenv";
dotenv.config();

import { Database } from "../db/database";
import { AppServer } from "./base/app-server";

(async () => {
    const db: Database = await Database.GetInstance();
    const appServer: AppServer = await AppServer.GetInstance(db);

    registerMiddleware(appServer);

    // Get port from environment and store in Express.
    const port = normalizePort(process.env.PORT || process.env.APP_PORT || '3000');
    appServer.ExpressApp.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(appServer.ExpressApp);

    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', (err) => onError(err, port));
    server.on('listening', () => onListening(server));
})();


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
    const numericPort = parseInt(val, 10);

    if (isNaN(numericPort)) {
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

    const bind = typeof _port === 'string'
        ? 'Pipe ' + _port
        : 'Port ' + _port;

    // handle specific listen errors with friendly messages
    switch (_error.code) {
        case 'EACCES':
            throw new Error(bind + ' requires elevated privileges')
        case 'EADDRINUSE':
            throw new Error(bind + ' is already in use')
        default:
            throw _error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(_server: http.Server): void {
    const addr = _server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

function registerMiddleware(appServer: AppServer): void {
    appServer.ExpressApp.use(logger('dev'));
    appServer.ExpressApp.use(express.json());
    appServer.ExpressApp.use(express.urlencoded({ extended: false }));
    appServer.ExpressApp.use(cookieParser());
    appServer.ExpressApp.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
    appServer.ExpressApp.use(appServer.Authenticator.initialize());
    appServer.ExpressApp.use(appServer.Authenticator.session());
}
