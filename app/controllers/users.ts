import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import passport from "passport";

import { Controller } from "./controller";
import { User } from "../models/user";
import { Database } from "db/database";
import { Repository } from "sequelize-typescript";

export class UsersController extends Controller {
    private usersRepo: Repository<User>;

    constructor(db: Database, authenticator: passport.Authenticator) {
        super(db);
        this.usersRepo = db.sequelize.getRepository(User);

        this.AddValidations(["Create"], [
            check("username", "Please provide a username.").isString(),
            check("email", "Please provide a valid email.").isEmail(),
            check("password", "Please provide a password.").isString(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findAll()
            .then((users: User[]) => {
                res.json(users);
            }).catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response, next: NextFunction): void => {
        UsersController.ValidateRequest(req, res);

        User.hashPassword(req.body.password)
            .then((hashedPassword: string) => {
                this.usersRepo.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                }).then((user: User) => {
                    res.json(user);
                }).catch((err: any) => {
                    throw new Error(err);
                });
            })
            .catch(err => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findOne().then((user: User) => {
            user.username = req.body.username;
            user.email = req.body.email;
            user.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findOne().then((user: User) => {
            user.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    };
}
