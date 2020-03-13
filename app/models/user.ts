/* eslint-disable import/no-cycle */
import { Table, Column, Model, BelongsToMany, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

import Assignment from './assignment';
import Ticket from './ticket';
import Role from './role';
import Subscription from './subscription';
import TicketCategory from './ticket-category';

@Table
export default class User extends Model<User> {
    @Column
    public firstName!: string | null;

    @Column
    public lastName!: string | null;

    @Column
    public username!: string;

    @Column
    public email!: string;

    @Column
    public password!: string;

    @ForeignKey(() => Role)
    @Column
    roleId!: number;

    @BelongsTo(() => Role)
    role: Role;

    @HasMany(() => Ticket)
    submittedTickets: Ticket[];

    @BelongsToMany(() => Ticket, {
        through: () => Assignment,
        foreignKey: 'userId',
        otherKey: 'ticketId',
        as: 'assignedTickets',
    })
    assignedTickets: (Ticket & { Assignment: Assignment })[];

    @BelongsToMany(() => TicketCategory, {
        through: () => Subscription,
        foreignKey: 'userId',
        otherKey: 'categoryId',
        as: 'subscriptions',
    })
    subscriptions: (TicketCategory & { Subscription: Subscription })[];

    /**
     * Gets a password's hash.
     * @param password Plaintext password
     */
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, +process.env.DB_PASSWORD_SALT_ROUNDS);
    }

    /**
     * Checks if a given password is valid for the user.
     * @param password Password to check
     */
    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    // Hide password by default
    public toJSON(): object {
        const values: any = { ...this.get() };

        delete values.password;
        return values;
    }

    public toJSONWithPassword(): object {
        const values = { ...this.get() };

        return values;
    }
}
