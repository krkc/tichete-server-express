/* eslint-disable import/no-cycle */
import { Table, Column, Model, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

import User from './user';
import Assignment from './assignment';
import TicketStatus from './ticket-status';
import TicketCategory from './ticket-category';
import Tag from './tag';

@Table
export default class Ticket extends Model<Ticket> {
    @Column
    public name!: string | null;

    @Column
    public description!: string | null;

    @ForeignKey(() => User)
    @Column
    creatorId!: number;

    @BelongsTo(() => User)
    creator: User;

    @ForeignKey(() => TicketStatus)
    @Column
    statusId!: number;

    @BelongsTo(() => TicketStatus)
    status: TicketStatus;

    @BelongsToMany(
        () => TicketCategory,
        () => Tag,
    )
    taggedCategories: TicketCategory[];

    @BelongsToMany(() => User, {
        through: () => Assignment,
        foreignKey: 'ticketId',
        otherKey: 'userId',
        as: 'assignees',
    })
    assignees: (User & { Assignment: Assignment })[];

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
