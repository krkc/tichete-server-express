import { Application } from 'express';
import Database from 'db/database';
import TicketStatusesController from '../controllers/ticket-statuses';
import { RoutesConfig } from '../base/routes-config';

import passport = require('passport');

class TicketStatusesRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const ticketStatusesController = new TicketStatusesController(database, authenticator, configuration);

        expressApp.get(
            '/tickets/statuses',
            ticketStatusesController.GetMiddleware('Index'),
            ticketStatusesController.Index,
        );
        expressApp.post(
            '/tickets/statuses',
            ticketStatusesController.GetMiddleware('Create'),
            ticketStatusesController.Create,
        );
        expressApp.patch(
            '/tickets/statuses/:id/edit',
            ticketStatusesController.GetMiddleware('Update'),
            ticketStatusesController.Update,
        );
        expressApp.delete(
            '/tickets/statuses/:id',
            ticketStatusesController.GetMiddleware('Delete'),
            ticketStatusesController.Delete,
        );
    };
}

export default new TicketStatusesRoutes();
