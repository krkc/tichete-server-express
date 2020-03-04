import { Application } from "express";
import passport = require("passport");

import { RoutesConfig } from "../base/routes-config";
import { AuthController } from "../controllers/auth";
import { Database } from "db/database";


class AuthRoutes implements RoutesConfig {
    public Register(app: Application, db: Database, authenticator: passport.Authenticator): void {
        const authController = new AuthController(db, authenticator);

        app.post('/auth/register', authController.GetMiddleware("Register"), authController.Register);
        app.post('/auth/login', authController.GetMiddleware("Login"), authController.Login);
        app.post('/auth/request', authController.GetMiddleware("Request"), authController.Request);
        app.post('/auth/reset', authController.GetMiddleware("Reset"), authController.Reset);
    }
}

export default new AuthRoutes();
