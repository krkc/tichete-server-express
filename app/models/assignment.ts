/* eslint-disable import/no-cycle */
import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';

import User from './user';
import Ticket from './ticket';

@Table
export default class Assignment extends Model<Assignment> {
    // https://github.com/sequelize/sequelize/issues/9596#issuecomment-478315268
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Ticket)
    @Column
    ticketId: number;
}
