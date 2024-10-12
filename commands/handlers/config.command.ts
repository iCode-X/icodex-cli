import { Command } from "commander";
import { AbstractCommand } from "../abstract.command";

/**
 * TODO
 * 1. config init: create config file
 * 2. config validate: validate config file
 * 3. config update: update a specific configuration key in the configuration file.
 */
export class ConfigCommand extends AbstractCommand {
  public async load(program: Command): Promise<void> {
    program
      .command("config <action>")
      .alias("cfg")
      .description(await this.buildDescription())
      .action(async (action) => {});
  }

  protected buildDescription(): string {
    return `Manage configuration for the project, such as initialization and validation.`;
  }
}
