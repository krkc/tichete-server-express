import moduleLoader from "../../utils/module-loader";
import { AuthStrategy } from "app/base/auth-strategy";

export default moduleLoader(__dirname) as Promise<AuthStrategy[]>;
