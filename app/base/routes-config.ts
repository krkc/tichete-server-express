import { AppServer } from "./app-server";

export interface RoutesConfig {
    Register(appServer: AppServer): void;
}
