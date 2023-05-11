import e from "express";

export interface HttpController {
	/**
	 * Attach to provided app controller routes
	 * @param app
	 */
	initRoutes(app: e.Router): void;
}
