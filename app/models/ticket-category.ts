/* eslint-disable import/no-cycle */
import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';
import Tag from './tag';
import Ticket from './ticket';
import Subscription from './subscription';
import User from './user';

@Table
export default class TicketCategory extends Model<TicketCategory> {
    @Column
    public name!: string | null;

    @BelongsToMany(
        () => Ticket,
        () => Tag,
    )
    taggedTickets: (Ticket & { Tag: Tag })[];

    @BelongsToMany(
        () => User,
        () => Subscription,
    )
    subscribedUsers: (User & { Subscription: Subscription })[];
}
