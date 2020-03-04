import { Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

import { Database } from "db/database";

export abstract class Controller {
    protected Middleware: any = { Validations: {}, Authentication: {} };

    constructor(protected db: Database) { }

    /**
     * Gets any middleware for a given route.
     * @param routeName Name of the route to get middleware for.
     */
    public GetMiddleware(routeName: string): any[] {
        let middleware: any[] = [];
        for (const categoryKey in this.Middleware) {
            if (this.Middleware.hasOwnProperty(categoryKey)) {
                const category = this.Middleware[categoryKey];
                if (category[routeName]) {
                    middleware = middleware.concat(category[routeName]);
                }
            }
        }
        return middleware;
    }

    /**
     * Add validation middleware for the given routes.
     * @param routeNames Names of the routes to add these validations.
     * @param validationMiddleware Array of validation middleware.
     */
    protected AddValidations(routeNames: string[], validationMiddleware: ValidationChain[]): void {
        routeNames.forEach((routeName) => {
            const routeValidations: ValidationChain[] = this.Middleware.Validations[routeName] || [];
            this.Middleware.Validations[routeName] = routeValidations.concat(validationMiddleware);
        });
    }

    /**
     * Add validation middleware for the given routes.
     * @param routeNames Names of the routes to add these validations.
     * @param authMiddleware Array of validation middleware.
     */
    protected AddAuthentication(routeNames: string[], authMiddleware: any[]): void {
        routeNames.forEach((routeName) => {
            const authValidations: any[] = this.Middleware.Authentication[routeName] || [];
            this.Middleware.Authentication[routeName] = authValidations.concat(authMiddleware);
        });
    }

    /**
     * Validates input data in a request.
     * @param req Route request
     * @param res Route response
     */
    protected static ValidateRequest(req: Request, res: Response): void {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }
    }
}
