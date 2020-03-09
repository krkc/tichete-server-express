import { ModelCtor, Model } from 'sequelize-typescript';
import moduleLoader from '../base/utils/module-loader';

export default moduleLoader(__dirname) as Promise<ModelCtor<Model<any, any>>[]>;
