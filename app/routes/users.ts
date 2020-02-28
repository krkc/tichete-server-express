import { Application } from "express";
import passport = require("passport");

import { Routes } from ".";
import { UsersController } from "../controllers/users";


class UserRoutes implements Routes {
    public Register(app: Application, authenticator: passport.Authenticator): void {
        const usersController = new UsersController(authenticator);

        app.get('/users', usersController.GetMiddleware("Index"), UsersController.Index);
        app.post('/users', usersController.GetMiddleware("Create"), UsersController.Create);
        app.patch('/users/:id/edit', usersController.GetMiddleware("Update"), UsersController.Update);
        app.delete('/users/:id', usersController.GetMiddleware("Delete"), UsersController.Delete);
    }
}

export default new UserRoutes();
