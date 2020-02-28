import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import passport from "passport";

import { Controller } from "./controller";
import { User } from "../models/user";

export class UsersController extends Controller {
    constructor(authenticator: passport.Authenticator) {
        super();
        this.AddValidations(["Create"], [
            check("username"),
            check("email"),
            check("password"),
        ]);
        this.AddAuthentication([
            "Index", "Create", "Update", "Delete"
        ], [ authenticator.authenticate('jwt') ]);
    }

    public static Index(req: Request, res: Response, next: NextFunction): void {
        User.findAll()
        .then((users: User[]) => {
            res.json(users);
        }).catch((err) => {
            throw new Error(err);
        });
    }

    public static Create(req: Request, res: Response, next: NextFunction): void {
        UsersController.ValidateRequest(req, res);

        User.hashPassword(req.body.password)
        .then((hashedPassword: string) => {
            User.create({
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
    }

    public static Update(req: Request, res: Response, next: NextFunction): void {
        User.findOne().then((user: User) => {
            user.username = "";
            user.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    }

    public static Delete(req: Request, res: Response, next: NextFunction): void {
        User.findOne().then((user: User) => {
            user.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    }
}
