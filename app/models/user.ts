import { Model } from 'sequelize';

import * as bcrypt from "bcrypt";

export class User extends Model {
    public id!: number;
    public firstName!: string | null;
    public lastName!: string | null;
    public username!: string;
    public email!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

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
        const values: any = Object.assign({}, this.get());

        delete values.password;
        return values;
    }

    public toJSONWithPassword(): object {
        const values = Object.assign({}, this.get());

        return values;
    }
}
