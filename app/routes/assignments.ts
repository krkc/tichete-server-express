import passport from 'passport';
import Database from 'db/database';
import { Application } from 'express';
import { RoutesConfig } from '../base/routes-config';
import AssignmentsController from '../controllers/assignments';

class AssignmentRoutes implements RoutesConfig {
    public Register = (
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void => {
        const assignmentsController = new AssignmentsController(database, authenticator, configuration);

        expressApp.get(
            ['/users/assignments'],
            assignmentsController.GetMiddleware('Index'),
            assignmentsController.Index,
        );

        expressApp.post(
            ['/users/:userId/assigned-tickets/:ticketId'],
            assignmentsController.GetMiddleware('Create'),
            assignmentsController.Create,
        );

        expressApp.delete(
            ['/users/assignments/:assignmentId'],
            assignmentsController.GetMiddleware('Delete'),
            assignmentsController.Delete,
        );
    };
}

export default new AssignmentRoutes();
