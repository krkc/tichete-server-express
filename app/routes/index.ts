import moduleLoader from '../base/utils/module-loader';
import { RoutesConfig } from '../base/routes-config';

export default moduleLoader(__dirname) as Promise<RoutesConfig[]>;
