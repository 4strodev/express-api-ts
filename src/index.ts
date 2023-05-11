import { App } from "./App";
import { UserController } from "./features/users/infrastructure/UserController";
import { getConfig } from "./shared/infrastructure/config/config";
import { AuthController } from "./features/auth/infrastructure/http/AuthController";

async function start() {
	const app = new App();

	// Attaching controllers
	app.attachController(new UserController());
	app.attachController(new AuthController());

	// Setting error handler
	app.setDefaultErrorHandler();

	// Creating initial configuration for application
	await app.bootstrap();

	app.listen(getConfig().PORT);
}

start();
