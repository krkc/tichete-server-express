import { AuthStrategy } from 'app/base/auth-strategy';
import moduleLoader from '../../utils/module-loader';

export default moduleLoader(__dirname) as Promise<AuthStrategy[]>;
