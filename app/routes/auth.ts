import { Application } from 'express';
import passport from 'passport';
import Database from 'db/database';
import { RoutesConfig } from '../base/routes-config';
import AuthController from '../controllers/auth';

class AuthRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const authController = new AuthController(database, authenticator, configuration);

        expressApp.post('/auth/register', authController.GetMiddleware('Register'), authController.Register);
        expressApp.post('/auth/login', authController.GetMiddleware('Login'), authController.Login);
        expressApp.post('/auth/request', authController.GetMiddleware('Request'), authController.Request);
        expressApp.post('/auth/reset', authController.GetMiddleware('Reset'), authController.Reset);
    };
}

export default new AuthRoutes();
