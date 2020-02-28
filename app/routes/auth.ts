import { Application } from "express";
import passport = require("passport");

import { Routes } from ".";
import { AuthController } from "../controllers/auth";


class AuthRoutes implements Routes {
    public Register(app: Application, authenticator: passport.Authenticator): void {
        const authController = new AuthController(authenticator);

        app.post('/auth/register', authController.GetMiddleware("Register"), AuthController.Register);
        app.post('/auth/login', authController.GetMiddleware("Login"), AuthController.Login);
        app.post('/auth/request', authController.GetMiddleware("Request"), AuthController.Request);
        app.post('/auth/reset', authController.GetMiddleware("Reset"), AuthController.Reset);
    }
}

export default new AuthRoutes();
