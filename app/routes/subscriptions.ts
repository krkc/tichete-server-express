import passport from 'passport';
import Database from 'db/database';
import { Application } from 'express';
import { RoutesConfig } from '../base/routes-config';
import SubscriptionsController from '../controllers/subscriptions';

class SubscriptionRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const subscriptionsController = new SubscriptionsController(database, authenticator, configuration);

        expressApp.get(
            ['/users/:userId/subscribed-categories', '/tickets/categories/:categoryId/subscribed-users'],
            subscriptionsController.GetMiddleware('Index'),
            subscriptionsController.Index,
        );

        expressApp.post(
            ['/users/:userId/subscribed-categories/:categoryId'],
            subscriptionsController.GetMiddleware('Create'),
            subscriptionsController.Create,
        );

        expressApp.delete(
            ['/users/subscriptions/:subscriptionId'],
            subscriptionsController.GetMiddleware('Delete'),
            subscriptionsController.Delete,
        );
    };
}

export default new SubscriptionRoutes();
