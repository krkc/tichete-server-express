/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';

import { Resource } from 'hal';
import { Includeable } from 'sequelize/types';
import Ticket from '../models/ticket';
import TicketStatus from '../models/ticket-status';
import Controller from './controller';

import passport = require('passport');

export default class TicketStatusesController extends Controller {
    private readonly ticketStatusesUrl = '/tickets/statuses';

    private ticketStatusesRepo: Repository<TicketStatus>;

    private ticketsRepo: Repository<Ticket>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketStatusesRepo = database.sequelize.getRepository(TicketStatus);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);

        this.AddValidations(['Create'], [check('name', 'Please provide a name for the ticket status.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        const includeOptions: Includeable[] = [];
        if (req.query.ticketId) {
            if (req.query.ticketId) {
                includeOptions.push({
                    model: this.ticketsRepo,
                    where: { ticketId: req.query.ticketId },
                });
            }
        }

        const ticketStatuses = await this.ticketStatusesRepo.findAll({ include: includeOptions });

        const ticketStatusesResource = new Resource({}, this.ticketStatusesUrl);
        const ticketStatusesToAdd: Resource[] = [];
        ticketStatuses.forEach(ticketStatus => {
            const ticketStatusResource = new Resource({}, `${this.ticketStatusesUrl}/${ticketStatus.id}`);
            ticketStatusesToAdd.push(ticketStatusResource);
        });
        ticketStatusesResource.embed(`ticketStatus`, ticketStatusesToAdd);

        res.json(ticketStatusesResource);
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const ticketStatus: TicketStatus = await this.ticketStatusesRepo.findByPk(req.params.ticketStatusId);

        const ticketStatusResource = new Resource(
            ticketStatus.toJSON(),
            `${this.ticketStatusesUrl}/${ticketStatus.id}`,
        );
        res.json(ticketStatusResource);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        TicketStatusesController.ValidateRequest(req);

        const ticketStatus = await this.ticketStatusesRepo.create({
            name: req.body.name,
        });
        res.json(ticketStatus);
    };

    public Update = async (req: Request, res: Response): Promise<void> => {
        TicketStatusesController.ValidateRequest(req);

        let ticketStatus = await this.ticketStatusesRepo.findByPk(req.params.ticketStatusId);
        ticketStatus.name = req.body.name ?? ticketStatus.name;
        ticketStatus = await ticketStatus.save();
        res.json(ticketStatus);
    };

    public Delete = (req: Request, res: Response): void => {
        this.ticketStatusesRepo.findOne().then((ticketStatus: TicketStatus) => {
            ticketStatus
                .destroy()
                .then(() => res.status(200))
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };
}
