import { Application } from "express";
import passport = require("passport");

import { RoutesConfig } from "../base/routes-config";
import { UsersController } from "../controllers/users";
import { Database } from "db/database";


class UserRoutes implements RoutesConfig {
    public Register(app: Application, db: Database, authenticator: passport.Authenticator): void {
        const usersController = new UsersController(db, authenticator);

        app.get('/users', usersController.GetMiddleware("Index"), usersController.Index);
        app.post('/users', usersController.GetMiddleware("Create"), usersController.Create);
        app.patch('/users/:id/edit', usersController.GetMiddleware("Update"), usersController.Update);
        app.delete('/users/:id', usersController.GetMiddleware("Delete"), usersController.Delete);
    }
}

export default new UserRoutes();
