import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Ticket extends Model<Ticket> {
    @Column
    public name!: string | null;
    @Column
    public description!: string | null;
}
