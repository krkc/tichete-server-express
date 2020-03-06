import moduleLoader from '../base/utils/module-loader';
import { ModelCtor, Model } from 'sequelize-typescript';

export default moduleLoader(__dirname) as Promise<ModelCtor<Model<any, any>>[]>;
