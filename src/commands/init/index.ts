import { Command } from "commander";
import { z } from "zod";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import prompts from "prompts";
import ora from "ora";
import { configSchema } from "@/src/lib/config";

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

		await promptConfig(cwd);
	});

async function promptConfig(cwd: string) {
	const options = await prompts([
		{
			type: "text",
			name: "modules",
			message: "Configure the import alias for regular modules",
			initial: "$lib"
		},
		{
			type: "text",
			name: "serverModules",
			message: "Configure the import alias for server-only modules",
			initial: "$lib/server"
		}
	]);

	const config = configSchema.parse({
		modules: options.modules,
		serverModules: options.serverModules
	});

	const spinner = ora("Writing config file").start();
	const targetPath = resolve(cwd, "svelte-cli.json");
	writeFileSync(targetPath, JSON.stringify(config, null, "\t"), "utf8");
	spinner.succeed(`Config file written to ${targetPath}`);
}
