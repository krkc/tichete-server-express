import { Application } from 'express';
import Database from 'db/database';
import { RoutesConfig } from '../base/routes-config';
import UsersController from '../controllers/users';

import passport = require('passport');

class UserRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const usersController = new UsersController(database, authenticator, configuration);

        expressApp.get('/users', usersController.GetMiddleware('Index'), usersController.Index);
        expressApp.get('/users/:userId', usersController.GetMiddleware('Show'), usersController.Show);
        expressApp.post('/users', usersController.GetMiddleware('Create'), usersController.Create);
        expressApp.patch('/users/:userId/edit', usersController.GetMiddleware('Update'), usersController.Update);
        expressApp.delete('/users/:userId', usersController.GetMiddleware('Delete'), usersController.Delete);

        expressApp.get('/users/search', usersController.GetMiddleware('Search'), usersController.Search);
    };
}

export default new UserRoutes();
