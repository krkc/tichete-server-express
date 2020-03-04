import { Request, Response, NextFunction } from "express";
import { check, CustomValidator } from "express-validator";
import passport from "passport";

import { Controller } from "./controller";
import { User } from "../models/user"
import { Database } from "db/database";
import { Repository } from "sequelize-typescript";

export class AuthController extends Controller {
    private usersRepo: Repository<User>;

    constructor(db: Database, authenticator: passport.Authenticator) {
        super(db);
        this.usersRepo = db.sequelize.getRepository(User);

        const passwordLength = 4;
        this.AddValidations(["Register"], [
            check("username", "Please provide a username.").isString(),
            check("email", "Please provide a valid email.").isEmail(),
            check("password", `Password must be at least ${passwordLength} characters long.`).isLength({ min: passwordLength }),
            check("confirmPassword")
                .custom(this.PasswordValidator),
        ]);
        this.AddValidations(["Login"], [
            check("username", "Please enter your username.").isString(),
            check("password", "Please enter your password.").isString(),
        ]);
        this.AddAuthentication([
            "Login"
        ], [ authenticator.authenticate('local') ]);
        this.AddAuthentication([
            "Request", "Reset"
        ], [ authenticator.authenticate('jwt') ]);
    }

    public Register(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

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
    }

    public Login(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

        throw new Error("Not implemented");
    }

    public Request(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

        throw new Error("Not implemented");
    }

    public Reset(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

        throw new Error("Not implemented");
    }

    private PasswordValidator: CustomValidator = (value, { req, location, path }) => {
        if (value !== req.body.password) {
            throw new Error("The passwords you entered don't match.");
        } else {
            return value;
        }
    }
}
