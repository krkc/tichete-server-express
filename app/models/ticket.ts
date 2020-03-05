import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';

import { User } from './user';
import { Assignment } from './assignment';

@Table
export class Ticket extends Model<Ticket> {
    @Column
    public name!: string | null;
    @Column
    public description!: string | null;

    @BelongsToMany(() => User, () => Assignment)
    users: User[];

    // Hide relationships by default
    public toJSON(): object {
        const values: any = Object.assign({}, this.get());

        delete values.Assignment;
        return values;
    }

    public toJSONWithRelationships(): object {
        const values = Object.assign({}, this.get());

        return values;
    }
}
