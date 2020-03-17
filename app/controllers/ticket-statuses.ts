/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import Controller from './controller';

import TicketStatus from '../models/ticket-status';

import passport = require('passport');

export default class TicketStatusesController extends Controller {
    private ticketStatusesRepo: Repository<TicketStatus>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketStatusesRepo = database.sequelize.getRepository(TicketStatus);

        this.AddValidations(['Create'], [check('name', 'Please provide a name for the ticket status.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response): void => {
        this.ticketStatusesRepo
            .findAll()
            .then((ticketStatuses: TicketStatus[]) => {
                res.json(ticketStatuses);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            TicketStatusesController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        this.ticketStatusesRepo
            .create({
                name: req.body.name,
            })
            .then((ticketStatus: TicketStatus) => {
                res.json(ticketStatus);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response): void => {
        try {
            TicketStatusesController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        this.ticketStatusesRepo.findOne().then((ticketStatus: TicketStatus) => {
            ticketStatus.name = req.body.name;
            ticketStatus
                .save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
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
