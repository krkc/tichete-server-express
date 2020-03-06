import { RoutesConfig } from '../base/routes-config';
import { AuthController } from '../controllers/auth';
import { AppServer } from 'app/base/app-server';

class AuthRoutes implements RoutesConfig {
    public Register(appServer: AppServer): void {
        const authController = new AuthController(appServer);

        appServer.ExpressApp.post('/auth/register', authController.GetMiddleware('Register'), authController.Register);
        appServer.ExpressApp.post('/auth/login', authController.GetMiddleware('Login'), authController.Login);
        appServer.ExpressApp.post('/auth/request', authController.GetMiddleware('Request'), authController.Request);
        appServer.ExpressApp.post('/auth/reset', authController.GetMiddleware('Reset'), authController.Reset);
    }
}

export default new AuthRoutes();
