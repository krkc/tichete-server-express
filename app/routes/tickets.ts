import { Application } from 'express';
import Database from 'db/database';
import { RoutesConfig } from '../base/routes-config';
import TicketsController from '../controllers/tickets';

import passport = require('passport');

class TicketRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const ticketsController = new TicketsController(database, authenticator, configuration);

        expressApp.get('/tickets', ticketsController.GetMiddleware('Index'), ticketsController.Index);
        expressApp.get('/tickets/:ticketId', ticketsController.GetMiddleware('Show'), ticketsController.Show);
        expressApp.post('/tickets', ticketsController.GetMiddleware('Create'), ticketsController.Create);
        expressApp.patch(
            '/tickets/:ticketId/edit',
            ticketsController.GetMiddleware('Update'),
            ticketsController.Update,
        );
        expressApp.delete('/tickets/:ticketId', ticketsController.GetMiddleware('Delete'), ticketsController.Delete);
    };
}

export default new TicketRoutes();
