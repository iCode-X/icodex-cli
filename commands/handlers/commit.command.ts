import { Command } from "commander";
import { AbstractCommand } from "../abstract.command";

export class CommitCommand extends AbstractCommand {
  public async load(program: Command): Promise<void> {
    program
      .command("commit <action>")
      .alias("cm")
      .description(await this.buildDescription())
      .action(async (action) => {});
  }

  protected buildDescription(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
