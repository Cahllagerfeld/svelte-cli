import { Command } from "commander";
import { ping } from "./commands/ping";
import { init } from "./commands/init";

async function main() {
	const program = new Command()
		.name("Svelte-CLI")
		.description("Svelte-CLI is a command line tool for Svelte")
		.version("0.0.1", "-v, --version", "output the current version");

	program.addCommand(ping);
	program.addCommand(init);
	program.parse();
}

main();
