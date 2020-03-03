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
import { RoutesLoader } from "./routes/index";
import passport from "passport";

const app: express.Application = express();

Database.GetInstance();
const auth: passport.Authenticator = RoutesLoader.RegisterRoutesAndAuth(app);

registerMiddleware(app);

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || process.env.APP_PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
function onError(error: any): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            throw new Error(bind + ' requires elevated privileges')
        case 'EADDRINUSE':
            throw new Error(bind + ' is already in use')
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

function registerMiddleware(_app: express.Application): void {
    _app.use(logger('dev'));
    _app.use(express.json());
    _app.use(express.urlencoded({ extended: false }));
    _app.use(cookieParser());
    _app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
    _app.use(auth.initialize());
    _app.use(auth.session());
}
