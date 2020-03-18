/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import Controller from './controller';

import TicketCategory from '../models/ticket-category';

import passport = require('passport');

export default class TicketCategoriesController extends Controller {
    private ticketCategoriesRepo: Repository<TicketCategory>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketCategoriesRepo = database.sequelize.getRepository(TicketCategory);

        this.AddValidations(['Create'], [check('name', 'Please provide a name for the ticket status.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response): void => {
        this.ticketCategoriesRepo
            .findAll()
            .then((ticketCategories: TicketCategory[]) => {
                res.json(ticketCategories);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            TicketCategoriesController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        this.ticketCategoriesRepo
            .create({
                name: req.body.name,
            })
            .then((ticketCategory: TicketCategory) => {
                res.json(ticketCategory);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response): void => {
        try {
            TicketCategoriesController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        this.ticketCategoriesRepo.findOne().then((ticketCategory: TicketCategory) => {
            ticketCategory.name = req.body.name;
            ticketCategory
                .save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const ticketCategory = await this.ticketCategoriesRepo.findByPk(req.params.ticketCategoryId);
        await ticketCategory.destroy();
        res.status(200).send();
    };
}
