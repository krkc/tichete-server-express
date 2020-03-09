/* eslint-disable import/no-cycle */
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import User from './user';
import Ticket from './ticket';

@Table
export default class Assignment extends Model<Assignment> {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Ticket)
    @Column
    ticketId: number;
}
