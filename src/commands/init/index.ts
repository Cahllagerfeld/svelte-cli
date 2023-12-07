import { Command } from "commander";
import { z } from "zod";
import { existsSync } from "node:fs";
import { resolve } from "path";

const initOptionsSchema = z.object({
	cwd: z.string()
});

export const init = new Command()
	.name("init")
	.description("Initialize your project")
	.option(
		"-c, --cwd <cwd>",
		"Set the current working directory, defaults to the current working directory",
		process.cwd()
	)
	.action(async (opts) => {
		const options = initOptionsSchema.parse(opts);
		const cwd = resolve(options.cwd);

		if (!existsSync(cwd)) {
			console.error(`The path ${cwd} does not exist. Please try again.`);
			process.exit(1);
		}
	});
