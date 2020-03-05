import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Role extends Model<Role> {
    @Column
    public name!: string;

    @HasMany(() => User)
    users: User[];
}
