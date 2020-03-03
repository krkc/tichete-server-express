import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import passport from "passport";

import { Controller } from "./controller";
import { Ticket } from "../models/ticket";

export class TicketsController extends Controller {
    constructor(authenticator: passport.Authenticator) {
        super();
        this.AddValidations(["Create"], [
            check("name", "Please provide a name.").isString(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public static Index(req: Request, res: Response, next: NextFunction): void {
        Ticket.findAll()
        .then((tickets: Ticket[]) => {
            res.json(tickets);
        }).catch((err: any) => {
            throw new Error(err);
        });
    }

    public static Create(req: Request, res: Response, next: NextFunction): void {
        TicketsController.ValidateRequest(req, res);

        Ticket.create({
            name: req.body.name,
            description: req.body.description,
        }).then((ticket: Ticket) => {
            res.json(ticket);
        }).catch((err: any) => {
            throw new Error(err);
        });
    }

    public static Update(req: Request, res: Response, next: NextFunction): void {
        Ticket.findOne().then((ticket: Ticket) => {
            ticket.name = "";
            ticket.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    }

    public static Delete(req: Request, res: Response, next: NextFunction): void {
        Ticket.findOne().then((ticket: Ticket) => {
            ticket.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    }
}
