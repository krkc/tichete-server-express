import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import passport from 'passport';
import Controller from './controller';

import Assignment from '../models/assignment';
import User from '../models/user';
import Ticket from '../models/ticket';

export default class AssignmentsController extends Controller {
    private assignmentsRepo: Repository<Assignment>;

    private usersRepo: Repository<User>;

    private ticketsRepo: Repository<Ticket>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.assignmentsRepo = database.sequelize.getRepository(Assignment);
        this.usersRepo = database.sequelize.getRepository(User);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);

        this.AddValidations(
            ['Create'],
            [
                check('userId', 'Please provide a user id.').isInt(),
                check('ticketId', 'Please provide a ticket id.').isInt(),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = (req: Request, res: Response): void => {
        let promise: Promise<void>;

        if (req.params.userId) {
            promise = this.usersRepo
                .findByPk(req.params.userId, { include: ['assignedTickets'] })
                .then((users: User) => {
                    res.json(users?.assignedTickets);
                });
        } else if (req.params.ticketId) {
            promise = this.ticketsRepo
                .findByPk(req.params.ticketId, { include: ['assignees'] })
                .then((ticket: Ticket) => {
                    res.json(ticket?.assignees);
                });
        }

        promise.catch((err: any) => {
            throw new Error(err);
        });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            AssignmentsController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }

        this.assignmentsRepo
            .create({
                userId: req.params.userId,
                ticketId: req.params.ticketId,
            })
            .then((assignment: Assignment) => {
                res.json(assignment);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const assignment = await this.assignmentsRepo.findByPk(req.params.assignmentId);
        await assignment.destroy();
        res.status(200).send();
    };
}
