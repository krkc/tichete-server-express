import { Request } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

import Database from 'db/database';
import passport from 'passport';

export default abstract class Controller {
    protected Middleware: any = { Validations: {}, Authentication: {} };

    constructor(
        protected database: Database,
        protected authenticator: passport.Authenticator,
        protected configuration: any,
    ) {}

    /**
     * Gets any middleware for a given route.
     * @param routeName Name of the route to get middleware for.
     */
    public GetMiddleware(routeName: string): any[] {
        let middleware: any[] = [];

        const categoryKeys = Object.keys(this.Middleware);

        categoryKeys.forEach((categoryKey: string) => {
            const category = this.Middleware[categoryKey];
            if (category[routeName]) {
                middleware = middleware.concat(category[routeName]);
            }
        });

        return middleware;
    }

    /**
     * Add validation middleware for the given routes.
     * @param routeNames Names of the routes to add these validations.
     * @param validationMiddleware Array of validation middleware.
     */
    protected AddValidations(routeNames: string[], validationMiddleware: ValidationChain[]): void {
        routeNames.forEach((routeName: string) => {
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
        routeNames.forEach((routeName: string) => {
            const authValidations: any[] = this.Middleware.Authentication[routeName] || [];
            this.Middleware.Authentication[routeName] = authValidations.concat(authMiddleware);
        });
    }

    /**
     * Validates input data in a request.
     * @param req Route request
     * @param res Route response
     */
    protected static ValidateRequest(req: Request): void {
        const errors = validationResult(req);
        if (errors.isEmpty()) return;

        const errObj = {
            error: 'Input Validation Error',
            detail: errors.array(),
            status: 422,
        };
        throw errObj;
    }
}
