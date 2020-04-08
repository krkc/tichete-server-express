/**
 * A single error class for either sending in a json response
 * or logging internally.
 */
export default class FormattedError extends Error {
    /**
     * @param internalData Data that can be included if logging internally.
     * @param status Status code. This must be provided in order to send as json.
     */
    constructor(
        message: string,
        name?: string,
        public internalData?: any,
        public status?: number,
    ) {
        super(message);
        super.name = name;
    }

    toJSON = () => {
        if (!this.status) throw new Error("JSON messages must provide a status code.");

        return {
            name: this.name,
            detail: this.message,
            status: this.status
        }
    }
}