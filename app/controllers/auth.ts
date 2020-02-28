import { Request, Response, NextFunction } from "express";
import { check, CustomValidator } from "express-validator";
import passport from "passport";

import { Controller } from "./controller";
import { User } from "../models/user"

export class AuthController extends Controller {
    constructor(authenticator: passport.Authenticator) {
        super();
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

    public static Register(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

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

    public static Login(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

        throw new Error("Not implemented");
    }

    public static Request(req: Request, res: Response, next: NextFunction): void {
        AuthController.ValidateRequest(req, res);

        throw new Error("Not implemented");
    }

    public static Reset(req: Request, res: Response, next: NextFunction): void {
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
