/* eslint-disable import/no-cycle */
import { Table, Column, Model, HasMany } from 'sequelize-typescript';

import Ticket from './ticket';

@Table
export default class TicketStatus extends Model<TicketStatus> {
    @Column
    public name!: string | null;

    @HasMany(() => Ticket)
    tickets: Ticket[];
}
