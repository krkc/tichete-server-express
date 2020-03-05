import { RoutesConfig } from "../base/routes-config";
import { RolesController } from "../controllers/roles";
import { AppServer } from "app/base/app-server";

class RoleRoutes implements RoutesConfig {
    public Register(appServer: AppServer): void {
        const rolesController = new RolesController(appServer);

        appServer.ExpressApp.get('/roles', rolesController.GetMiddleware("Index"), rolesController.Index);
        appServer.ExpressApp.post('/roles', rolesController.GetMiddleware("Create"), rolesController.Create);
        appServer.ExpressApp.patch('/roles/:id/edit', rolesController.GetMiddleware("Update"), rolesController.Update);
        appServer.ExpressApp.delete('/roles/:id', rolesController.GetMiddleware("Delete"), rolesController.Delete);
    }
}

export default new RoleRoutes();
