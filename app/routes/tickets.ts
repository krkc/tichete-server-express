import { RoutesConfig } from "../base/routes-config";
import { TicketsController } from "../controllers/tickets";
import { AppServer } from "app/base/app-server";


class TicketRoutes implements RoutesConfig {
    public Register(appServer: AppServer): void {
        const ticketsController = new TicketsController(appServer);

        appServer.ExpressApp.get('/tickets', ticketsController.GetMiddleware("Index"), ticketsController.Index);
        appServer.ExpressApp.post('/tickets', ticketsController.GetMiddleware("Create"), ticketsController.Create);
        appServer.ExpressApp.patch('/tickets/:id/edit', ticketsController.GetMiddleware("Update"), ticketsController.Update);
        appServer.ExpressApp.delete('/tickets/:id', ticketsController.GetMiddleware("Delete"), ticketsController.Delete);
    }
}

export default new TicketRoutes();
