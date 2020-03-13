import { Application } from 'express';
import Database from 'db/database';
import TicketCategoriesController from '../controllers/ticket-statuses';
import { RoutesConfig } from '../base/routes-config';

import passport = require('passport');

class TicketCategoriesRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const ticketCategoriesController = new TicketCategoriesController(database, authenticator, configuration);

        expressApp.get(
            '/tickets/categories',
            ticketCategoriesController.GetMiddleware('Index'),
            ticketCategoriesController.Index,
        );
        expressApp.post(
            '/tickets/categories',
            ticketCategoriesController.GetMiddleware('Create'),
            ticketCategoriesController.Create,
        );
        expressApp.patch(
            '/tickets/categories/:id/edit',
            ticketCategoriesController.GetMiddleware('Update'),
            ticketCategoriesController.Update,
        );
        expressApp.delete(
            '/tickets/categories/:id',
            ticketCategoriesController.GetMiddleware('Delete'),
            ticketCategoriesController.Delete,
        );
    };
}

export default new TicketCategoriesRoutes();
