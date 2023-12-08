import { z } from "zod";

export const configSchema = z.object({
	modules: z.string(),
	serverModules: z.string()
});
