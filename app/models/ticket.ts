/* eslint-disable import/no-cycle */
import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';

import User from './user';
import Assignment from './assignment';

@Table
export default class Ticket extends Model<Ticket> {
    @Column
    public name!: string | null;

    @Column
    public description!: string | null;

    @BelongsToMany(
        () => User,
        () => Assignment,
    )
    users: User[];

    // Hide relationships by default
    public toJSON(): object {
        const values: any = { ...this.get() };

        delete values.Assignment;
        return values;
    }

    public toJSONWithRelationships(): object {
        const values = { ...this.get() };

        return values;
    }
}
