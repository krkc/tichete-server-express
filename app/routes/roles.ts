import { Application } from 'express';
import Database from 'db/database';
import RolesController from '../controllers/roles';
import { RoutesConfig } from '../base/routes-config';

import passport = require('passport');

class RoleRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const rolesController = new RolesController(database, authenticator, configuration);

        expressApp.get('/roles', rolesController.GetMiddleware('Index'), rolesController.Index);
        expressApp.post('/roles', rolesController.GetMiddleware('Create'), rolesController.Create);
        expressApp.patch('/roles/:id/edit', rolesController.GetMiddleware('Update'), rolesController.Update);
        expressApp.delete('/roles/:id', rolesController.GetMiddleware('Delete'), rolesController.Delete);
    };
}

export default new RoleRoutes();
