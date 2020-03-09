/* eslint-disable import/no-cycle */
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import User from './user';

@Table
export default class Role extends Model<Role> {
    @Column
    public name!: string;

    @HasMany(() => User)
    users: User[];
}
