/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';

import { Resource } from 'hal';
import { Includeable } from 'sequelize/types';
import User from '../models/user';
import Role from '../models/role';
import Controller from './controller';

import passport = require('passport');

export default class RolesController extends Controller {
    private readonly rolesUrl = '/users/roles';

    private rolesRepo: Repository<Role>;

    private usersRepo: Repository<User>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.rolesRepo = database.sequelize.getRepository(Role);
        this.usersRepo = database.sequelize.getRepository(User);

        this.AddValidations(['Create'], [check('name', 'Please provide a name for the role.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        const includeOptions: Includeable[] = [];
        if (req.query.userId) {
            if (req.query.userId) {
                includeOptions.push({
                    model: this.usersRepo,
                    where: { userId: req.query.userId },
                });
            }
        }

        const roles = await this.rolesRepo.findAll({ include: includeOptions });

        const rolesResource = new Resource({}, this.rolesUrl);
        const rolesToAdd: Resource[] = [];
        roles.forEach(role => {
            const roleResource = new Resource({}, `${this.rolesUrl}/${role.id}`);
            rolesToAdd.push(roleResource);
        });
        rolesResource.embed(`roles`, rolesToAdd);

        res.json(rolesResource);
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const role: Role = await this.rolesRepo.findByPk(req.params.roleId);

        const roleResource = new Resource(role.toJSON(), `${this.rolesUrl}/${role.id}`);
        res.json(roleResource);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        RolesController.ValidateRequest(req);

        const role = await this.rolesRepo.create({
            name: req.body.name,
        });
        res.json(role);
    };

    public Update = async (req: Request, res: Response): Promise<void> => {
        RolesController.ValidateRequest(req);

        let role = await this.rolesRepo.findByPk(req.params.roleId);
        role.name = req.body.name ?? role.name;
        role = await role.save();
        res.json(role);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const role = await this.rolesRepo.findByPk(req.params.roleId);
        await role.destroy();
        res.status(200).send();
    };
}
