/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import Controller from './controller';

import Ticket from '../models/ticket';

import passport = require('passport');

export default class TicketsController extends Controller {
    private ticketsRepo: Repository<Ticket>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);

        this.AddValidations(['Create'], [check('name', 'Please provide a name.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response): void => {
        this.ticketsRepo
            .findAll()
            .then((tickets: Ticket[]) => {
                res.json(tickets);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            TicketsController.ValidateRequest(req, res);
        } catch (e) {
            if (e.errors) return;
        }
        this.ticketsRepo
            .create({
                name: req.body.name,
                description: req.body.description,
            })
            .then((ticket: Ticket) => {
                res.json(ticket);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response): void => {
        this.ticketsRepo.findOne().then((ticket: Ticket) => {
            ticket.name = '';
            ticket
                .save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = (req: Request, res: Response): void => {
        this.ticketsRepo.findOne().then((ticket: Ticket) => {
            ticket
                .destroy()
                .then(() => res.status(200))
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };
}
