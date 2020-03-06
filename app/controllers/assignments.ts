import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import { AppServer } from 'app/base/app-server';
import { Controller } from './controller';

import { Assignment } from '../models/assignment';
import { User } from '../models/user';
import { Ticket } from '../models/ticket';

export class AssignmentsController extends Controller {
    private assignmentsRepo: Repository<Assignment>;
    private usersRepo: Repository<User>;
    private ticketsRepo: Repository<Ticket>;

    constructor(appServer: AppServer) {
        super(appServer);
        this.assignmentsRepo = appServer.Database.sequelize.getRepository(Assignment);
        this.usersRepo = appServer.Database.sequelize.getRepository(User);
        this.ticketsRepo = appServer.Database.sequelize.getRepository(Ticket);

        this.AddValidations(['Create'], [
            check('userId', 'Please provide a user id.').isInt(),
            check('ticketId', 'Please provide a ticket id.').isInt(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Create", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response, next: NextFunction): void => {
        let promise: Promise<void>;

        if (req.params.userId) {
            promise = this.usersRepo.findByPk(req.params.userId, {include: [this.ticketsRepo]})
                .then((user: User) => {
                    res.json(user.tickets);
                });
        } else if (req.params.ticketId) {
            promise = this.ticketsRepo.findByPk(req.params.ticketId)
                .then((ticket: Ticket) => {
                    res.json(ticket.users);
                });
        }

        promise.catch((err: any) => {
            throw new Error(err);
        });
    };

    public Create = (req: Request, res: Response, next: NextFunction): void => {
        try{AssignmentsController.ValidateRequest(req, res);} catch(e){if (e.errors) return;}

        this.assignmentsRepo.create({
            userId: req.params.userId,
            ticketId: req.params.ticketId
        }).then((assignment: Assignment) => {
            res.json(assignment);
        }).catch((err: any) => {
            throw new Error(err);
        });
    };

    public Delete = (req: Request, res: Response, next: NextFunction): void => {
        this.assignmentsRepo.findByPk(req.params.assignmentId)
            .then((assignment: Assignment) => {
                assignment.destroy()
                    .then(() => res.status(200))
                    .catch((err) => {
                        throw new Error(err);
                    });
            });
    };
}
