import { Application } from "express";
import passport = require("passport");

import { Routes } from ".";
import { TicketsController } from "../controllers/tickets";


class TicketRoutes implements Routes {
    public Register(app: Application, authenticator: passport.Authenticator): void {
        const ticketsController = new TicketsController(authenticator);

        app.get('/tickets', ticketsController.GetMiddleware("Index"), TicketsController.Index);
        app.post('/tickets', ticketsController.GetMiddleware("Create"), TicketsController.Create);
        app.patch('/tickets/:id/edit', ticketsController.GetMiddleware("Update"), TicketsController.Update);
        app.delete('/tickets/:id', ticketsController.GetMiddleware("Delete"), TicketsController.Delete);
    }
}

export default new TicketRoutes();
