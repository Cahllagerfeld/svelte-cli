import { Command } from "commander";
import { z } from "zod";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import prompts from "prompts";
import ora from "ora";
import pc from "picocolors";
import { configSchema } from "@/src/lib/config";

const initOptionsSchema = z.object({
	cwd: z.string(),
	yes: z.boolean()
});

export const init = new Command()
	.name("init")
	.description("Initialize your project")
	.option("-y, --yes", "Skip the prompts and use the default values", false)
	.option(
		"-c, --cwd <cwd>",
		"Set the current working directory, defaults to the current working directory",
		process.cwd()
	)
	.action(async (opts) => {
		const options = initOptionsSchema.parse(opts);
		const cwd = resolve(options.cwd);
		const yes = options.yes;

		if (!existsSync(cwd)) {
			console.error(`The path ${cwd} does not exist. Please try again.`);
			process.exit(1);
		}

		await promptConfig(cwd, yes);
	});

async function promptConfig(cwd: string, yes = false) {
	const highlight = (text: string) => pc.cyan(text);
	const options = await prompts([
		{
			type: "text",
			name: "modules",
			message: `Configure the import alias for ${highlight("regular modules")}`,
			initial: "$lib"
		},
		{
			type: "text",
			name: "serverModules",
			message: `Configure the import alias for ${highlight("server-only modules")}`,
			initial: "$lib/server"
		}
	]);

	const config = configSchema.parse({
		modules: options.modules,
		serverModules: options.serverModules
	});

	if (!yes) {
		const { proceed } = await prompts({
			type: "confirm",
			name: "proceed",
			message: "Would you like to write the config file now?",
			initial: true
		});

		if (!proceed) {
			process.exit(0);
		}
	}

	const spinner = ora("Writing config file").start();
	const targetPath = resolve(cwd, "svelte-cli.json");
	writeFileSync(targetPath, JSON.stringify(config, null, "\t"), "utf8");
	spinner.succeed(`Config file written to ${targetPath}`);
}
