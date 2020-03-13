/* eslint-disable import/no-cycle */
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import User from './user';
import TicketCategory from './ticket-category';

@Table
export default class Subscription extends Model<Subscription> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => TicketCategory)
    @Column
    categoryId: number;
}
