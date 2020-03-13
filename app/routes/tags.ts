import passport from 'passport';
import Database from 'db/database';
import { Application } from 'express';
import { RoutesConfig } from '../base/routes-config';
import TagsController from '../controllers/tags';

class TagRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const tagsController = new TagsController(database, authenticator, configuration);

        expressApp.get(
            ['/tickets/:ticketId/tagged-categories', '/tickets/categories/:categoryId/tagged-tickets'],
            tagsController.GetMiddleware('Index'),
            tagsController.Index,
        );

        expressApp.post(
            ['/tickets/:ticketId/tagged-categories/:categoryId'],
            tagsController.GetMiddleware('Create'),
            tagsController.Create,
        );

        expressApp.delete(['/tickets/tags/:tagId'], tagsController.GetMiddleware('Delete'), tagsController.Delete);
    };
}

export default new TagRoutes();
