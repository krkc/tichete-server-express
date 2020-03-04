import { Application } from "express";
import passport = require("passport");

import { RoutesConfig } from "../base/routes-config";
import { TicketsController } from "../controllers/tickets";
import { Database } from "db/database";


class TicketRoutes implements RoutesConfig {
    public Register(app: Application, db: Database, authenticator: passport.Authenticator): void {
        const ticketsController = new TicketsController(db, authenticator);

        app.get('/tickets', ticketsController.GetMiddleware("Index"), ticketsController.Index);
        app.post('/tickets', ticketsController.GetMiddleware("Create"), ticketsController.Create);
        app.patch('/tickets/:id/edit', ticketsController.GetMiddleware("Update"), ticketsController.Update);
        app.delete('/tickets/:id', ticketsController.GetMiddleware("Delete"), ticketsController.Delete);
    }
}

export default new TicketRoutes();
