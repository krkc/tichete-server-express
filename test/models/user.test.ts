import { Sequelize } from 'sequelize-typescript';
import User from '../../app/models/user';
import Role from '../../app/models/role';
import Assignment from '../../app/models/assignment';
import Ticket from '../../app/models/ticket';

let user: User;

beforeAll(() => {
    const sequelize = new Sequelize({ dialect: 'mysql', models: [User, Role, Assignment, Ticket] });
    user = sequelize.getRepository(User).build();
});

describe('testing user password field visibility when converted to json', () => {
    const passwordPropertyName = 'password';

    beforeAll(() => {
        user.password = 'my-test-password';
    });

    test('hides password field when converted to json', () => {
        expect(user.toJSON()).not.toHaveProperty(passwordPropertyName);
    });

    test('shows password field when converted to json', () => {
        expect(user.toJSONWithPassword()).toHaveProperty(passwordPropertyName);
    });
});

describe('testing user password operations', () => {
    const plaintextPassword = 'test-password';
    let hashedPassword: string;

    beforeAll(async () => {
        hashedPassword = await User.hashPassword(plaintextPassword);
    });

    test('gets the hash of a plaintext password', async () => {
        expect(hashedPassword).toMatch(/\S+/);
    });

    test('verifies a plaintext password against the stored hashed password', async () => {
        user.password = hashedPassword;
        expect(await user.checkPassword(plaintextPassword)).toBe(true);
        expect(await user.checkPassword('wrong-password')).toBe(false);
        try {
            await user.checkPassword(null);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
