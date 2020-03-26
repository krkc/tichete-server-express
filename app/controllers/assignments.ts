import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import passport from 'passport';
import Controller from './controller';

import Assignment from '../models/assignment';
import User from '../models/user';
import Ticket from '../models/ticket';
import { Resource } from 'hal';
import { FindOptions, where } from 'sequelize/types';

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

    public Index = async (req: Request, res: Response): Promise<void> => {
        let assignmentResources = new Resource({}, '/users/assignments');
        const assignmentsToAdd: Resource[] = [];
        const findOptions: FindOptions = {};
        if (req.query.userId) {
            findOptions.where = { userId: req.query.userId };
        } else if (req.query.ticketId) {
            findOptions.where = { ticketId: req.query.ticketId };
        }
        const assignments: Assignment[] = await this.assignmentsRepo.findAll(findOptions);
        assignments.forEach((assignment) => {            
            const assignmentResource = new Resource(assignment.toJSON(), `/users/assignments/${assignment.id}`);
            assignmentResource.link('assignedTicket', `/tickets/${assignment.ticketId}`);
            assignmentResource.link('assignedUser', `/users/${assignment.userId}`);
            assignmentsToAdd.push(assignmentResource);
        });
        assignmentResources.embed('assignments', assignmentsToAdd);
        res.json(assignmentResources);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        AssignmentsController.ValidateRequest(req);

        const assignment = await this.assignmentsRepo.create({
            userId: req.params.userId,
            ticketId: req.params.ticketId,
        });
        res.json(assignment);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const assignment = await this.assignmentsRepo.findByPk(req.params.assignmentId);
        await assignment.destroy();
        res.status(200).send();
    };
}
