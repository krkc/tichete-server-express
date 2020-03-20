/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import { Resource } from 'hal';
import Controller from './controller';

import TicketCategory from '../models/ticket-category';

import passport = require('passport');

export default class TicketCategoriesController extends Controller {
    private readonly ticketCategoriesUrl = '/tickets/categories';

    private ticketCategoriesRepo: Repository<TicketCategory>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketCategoriesRepo = database.sequelize.getRepository(TicketCategory);

        this.AddValidations(['Create'], [check('name', 'Please provide a name for the ticket status.').isString()]);
        // this.AddAuthentication([
        //     "Index", "Create", "Update", "Delete"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        const ticketCategories = await this.ticketCategoriesRepo.findAll();

        const ticketCategoriesResource = new Resource({}, this.ticketCategoriesUrl);
        const ticketCategoriesToAdd: Resource[] = [];
        ticketCategories.forEach(ticketCategory => {
            const ticketCategoryResource = new Resource({}, `${this.ticketCategoriesUrl}/${ticketCategory.id}`);
            ticketCategoriesToAdd.push(ticketCategoryResource);
        });
        ticketCategoriesResource.embed(`ticketCategory`, ticketCategoriesToAdd);

        res.json(ticketCategoriesResource);
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const ticketCategory: TicketCategory = await this.ticketCategoriesRepo.findByPk(req.params.ticketCategoryId);

        const ticketCategoryResource = new Resource(
            ticketCategory.toJSON(),
            `${this.ticketCategoriesUrl}/${ticketCategory.id}`,
        );
        ticketCategoryResource.link('taggedTickets', `${this.ticketCategoriesUrl}/${ticketCategory.id}/tagged-tickets`);
        ticketCategoryResource.link(
            'subscribedUsers',
            `${this.ticketCategoriesUrl}/${ticketCategory.id}/subscribed-users`,
        );
        res.json(ticketCategoryResource);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        TicketCategoriesController.ValidateRequest(req);

        const ticketCategory = await this.ticketCategoriesRepo.create({
            name: req.body.name,
        });
        res.json(ticketCategory);
    };

    public Update = async (req: Request, res: Response): Promise<void> => {
        TicketCategoriesController.ValidateRequest(req);

        let ticketCategory = await this.ticketCategoriesRepo.findByPk(req.params.ticketCategoryId);
        ticketCategory.name = req.body.name ?? ticketCategory.name;
        ticketCategory = await ticketCategory.save();
        res.json(ticketCategory);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const ticketCategory = await this.ticketCategoriesRepo.findByPk(req.params.ticketCategoryId);
        await ticketCategory.destroy();
        res.status(200).send();
    };
}
