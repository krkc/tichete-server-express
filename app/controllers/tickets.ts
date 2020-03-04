import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import passport from "passport";
import { Repository } from "sequelize-typescript";

import { Controller } from "./controller";
import { Ticket } from "../models/ticket";
import { Database } from "db/database";

export class TicketsController extends Controller {
    private ticketsRepo: Repository<Ticket>;

    constructor(db: Database, authenticator: passport.Authenticator) {
        super(db);
        this.ticketsRepo = db.sequelize.getRepository(Ticket);

        this.AddValidations(["Create"], [
            check("name", "Please provide a name.").isString(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index(req: Request, res: Response, next: NextFunction): void {
        this.ticketsRepo.findAll()
        .then((tickets: Ticket[]) => {
            res.json(tickets);
        }).catch((err: any) => {
            throw new Error(err);
        });
    }

    public Create(req: Request, res: Response, next: NextFunction): void {
        TicketsController.ValidateRequest(req, res);

        this.ticketsRepo.create({
            name: req.body.name,
            description: req.body.description,
        }).then((ticket: Ticket) => {
            res.json(ticket);
        }).catch((err: any) => {
            throw new Error(err);
        });
    }

    public Update(req: Request, res: Response, next: NextFunction): void {
        this.ticketsRepo.findOne().then((ticket: Ticket) => {
            ticket.name = "";
            ticket.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    }

    public Delete(req: Request, res: Response, next: NextFunction): void {
        this.ticketsRepo.findOne().then((ticket: Ticket) => {
            ticket.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    }
}
