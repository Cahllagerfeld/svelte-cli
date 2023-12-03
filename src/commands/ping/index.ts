import { Command } from "commander";

export const ping = new Command()
	.name("ping")
	.description("Ping the server")
	.action(() => {
		console.log("Pong!");
	});
