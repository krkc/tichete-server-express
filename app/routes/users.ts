import { RoutesConfig } from "../base/routes-config";
import { UsersController } from "../controllers/users";
import { AppServer } from "app/base/app-server";

class UserRoutes implements RoutesConfig {
    public Register(appServer: AppServer): void {
        const usersController = new UsersController(appServer);

        appServer.ExpressApp.get('/users', usersController.GetMiddleware("Index"), usersController.Index);
        appServer.ExpressApp.get('/users/:userId', usersController.GetMiddleware("Show"), usersController.Show);
        appServer.ExpressApp.post('/users', usersController.GetMiddleware("Create"), usersController.Create);
        appServer.ExpressApp.patch('/users/:userId/edit', usersController.GetMiddleware("Update"), usersController.Update);
        appServer.ExpressApp.delete('/users/:userId', usersController.GetMiddleware("Delete"), usersController.Delete);

        appServer.ExpressApp.get('/users/search', usersController.GetMiddleware("Search"), usersController.Search);
    }
}

export default new UserRoutes();
