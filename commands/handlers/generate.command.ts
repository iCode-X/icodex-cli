import chalk from "chalk";
import Table from "cli-table3";
import { Command } from "commander";
import { AbstractCollection } from "../../lib/schematics/abstract.collection";
import { CollectionFactory } from "../../lib/schematics/collection.factory";
import { Schematic } from "../../lib/schematics/imean.collection";
import { loadConfiguration } from "../../lib/utils/load-configuration";
import { AbstractCommand } from "../abstract.command";
import { Input } from "../command.input";

export class GenerateCommand extends AbstractCommand {
  public async load(program: Command): Promise<void> {
    program
      .command("generate <schematic> [name] [path]")
      .alias("g")
      .description(await this.buildDescription())
      .option("-p, --project [project]", "Project in which to generate files.")
      .option(
        "-c, --collection [collectionName]",
        "Schematics collection to use.",
      )
      .action(async (schematic: string, name: string, path: string) => {
        const options: Input[] = [];
        options.push({
          name: "collection",
          value: program.opts().collection,
        });
        options.push({
          name: "project",
          value: program.opts().project,
        });

        const inputs: Input[] = [];
        inputs.push({ name: "schematic", value: schematic });
        inputs.push({ name: "name", value: name });
        inputs.push({ name: "path", value: path });

        await this.action.handle(inputs, options);
      });
  }

  protected async buildDescription(): Promise<string> {
    const collection = await this.getCollection();
    return (
      "Generate a iMean element.\n" +
      `  Schematics available on ${chalk.bold(collection)} collection:\n` +
      this.buildSchematicsListAsTable(await this.getSchematics(collection))
    );
  }

  private buildSchematicsListAsTable(schematics: Schematic[]): string {
    const leftMargin = "    ";
    const tableConfig = {
      head: ["name", "alias", "description"],
      chars: {
        left: leftMargin.concat("│"),
        "top-left": leftMargin.concat("┌"),
        "bottom-left": leftMargin.concat("└"),
        mid: "",
        "left-mid": "",
        "mid-mid": "",
        "right-mid": "",
      },
    };
    const table: any = new Table(tableConfig);
    for (const schematic of schematics) {
      table.push([
        chalk.green(schematic.name),
        chalk.cyan(schematic.alias),
        schematic.description,
      ]);
    }
    return table.toString();
  }

  private async getCollection(): Promise<string> {
    const configuration = await loadConfiguration();

    return configuration.collection;
  }

  private async getSchematics(collection: string): Promise<Schematic[]> {
    const abstractCollection: AbstractCollection = CollectionFactory.create(
      collection,
    );
    return abstractCollection.getSchematics();
  }
}
