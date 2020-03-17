/* eslint-disable no-dupe-class-members */
/* eslint-disable max-classes-per-file */
declare module 'hal' {
    /**
     * This class designs a HAL resource.
     *
     * @param resourceObject - Base fields of this resource.
     * @param uri - The link to this property.
     */
    export class Resource {
        constructor(resourceObject: any, uri: string);

        /**
         * Adds a new link to resource.
         */
        link(link: Link): void;

        /**
         * Adds a new link to resource.
         */
        link(rel: string, hrefOrAttributes: string): void;

        /**
         * Embeds other resource(s) to current resource.
         */
        embed(rel: string, resources: Resource[]): void;
    }

    /**
     * This class designs a HAL link.
     */
    export class Link {
        constructor(rel: any, hrefOrAttributes: string);
    }
}
