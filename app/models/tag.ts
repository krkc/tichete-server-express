/* eslint-disable import/no-cycle */
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import TicketCategory from './ticket-category';
import Ticket from './ticket';

@Table
export default class Tag extends Model<Tag> {
    @ForeignKey(() => TicketCategory)
    @Column
    categoryId: number;

    @ForeignKey(() => Ticket)
    @Column
    ticketId: number;
}
