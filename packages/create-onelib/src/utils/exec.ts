import { execFile } from "node:child_process";

export type ExecResult =
	| { ok: true; stdout: string; stderr: string }
	| { ok: false; message: string };

interface ExecOptions {
	cwd?: string;
	timeoutMs?: number;
}

export function execCommand(
	command: string,
	args: string[],
	options: ExecOptions = {},
): Promise<ExecResult> {
	return new Promise((resolve) => {
		execFile(
			command,
			args,
			{
				cwd: options.cwd,
				timeout: options.timeoutMs,
			},
			(error, stdout, stderr) => {
				if (error) {
					if (error.killed) {
						resolve({ ok: false, message: `Command timed out: ${command}` });
					} else {
						resolve({ ok: false, message: error.message });
					}
				} else {
					resolve({ ok: true, stdout, stderr });
				}
			},
		);
	});
}

export function isCommandAvailable(command: string): Promise<boolean> {
	return new Promise((resolve) => {
		execFile("which", [command], (error) => {
			resolve(!error);
		});
	});
}
