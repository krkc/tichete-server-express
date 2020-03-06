import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import { AppServer } from 'app/base/app-server';
import { Controller } from './controller';

import { Role } from '../models/role';

export class RolesController extends Controller {
    private rolesRepo: Repository<Role>;

    constructor(appServer: AppServer) {
        super(appServer);
        this.rolesRepo = appServer.Database.sequelize.getRepository(Role);

        this.AddValidations(['Create'], [
            check('name', 'Please provide a name for the role.').isString(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response, next: NextFunction): void => {
        this.rolesRepo.findAll()
            .then((roles: Role[]) => {
                res.json(roles);
            }).catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response, next: NextFunction): void => {
        try{RolesController.ValidateRequest(req, res);} catch(e){if (e.errors) return;}
        this.rolesRepo.create({
            name: req.body.name,
        }).then((role: Role) => {
            res.json(role);
        }).catch((err: any) => {
            throw new Error(err);
        });
    };

    public Update = (req: Request, res: Response, next: NextFunction): void => {
        this.rolesRepo.findOne().then((role: Role) => {
            role.name = req.body.name;
            role.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = (req: Request, res: Response, next: NextFunction): void => {
        this.rolesRepo.findOne().then((role: Role) => {
            role.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    };
}
