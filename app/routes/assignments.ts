import { RoutesConfig } from '../base/routes-config';
import { AssignmentsController } from '../controllers/assignments';
import { AppServer } from 'app/base/app-server';

class AssignmentRoutes implements RoutesConfig {
    public Register(appServer: AppServer): void {
        const assignmentsController = new AssignmentsController(appServer);

        appServer.ExpressApp.get([
            '/users/:userId/tickets',
            '/tickets/:ticketId/users'
        ],
            assignmentsController.GetMiddleware('Index'),
            assignmentsController.Index
        );

        appServer.ExpressApp.post([
            '/users/:userId/tickets/:ticketId',
            '/tickets/:ticketId/users/:userId'
        ],
            assignmentsController.GetMiddleware('Create'),
            assignmentsController.Create
        );

        appServer.ExpressApp.delete([
            '/users/:userId/assignments/:assignmentId',
            '/tickets/:ticketId/assignments/:assignmentId'
        ],
            assignmentsController.GetMiddleware('Delete'),
            assignmentsController.Delete
        );
    }
}

export default new AssignmentRoutes();
