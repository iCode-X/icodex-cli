import chalk from 'chalk';
import Table from 'cli-table3';
import { Command } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';
import { UnnamedDistinctQuestion } from 'inquirer/dist/commonjs/types';
import path from 'path';
import { AbstractCollection } from '../../lib/schematics/abstract.collection';
import { CollectionFactory } from '../../lib/schematics/collection.factory';
import { Schematic } from '../../lib/schematics/imean.collection';
import { loadConfiguration } from '../../lib/utils/load-configuration';
import { AbstractCommand } from '../abstract.command';
import { Input } from '../command.input';

export class GenerateCommand extends AbstractCommand {
  public async load(program: Command): Promise<void> {
    program
      .command('generate <schematic> [name] [path]')
      .alias('g')
      .description(await this.buildDescription())
      .option('-p, --project [project]', 'Project in which to generate files.')
      .option('-c, --collection [collectionName]', 'Schematics collection to use.')
      .option('--type [type]', 'Component type to generate') // 添加 type 选项
      .action(async (schematic: string, name: string, path: string) => {
        const options: Input[] = [];
        options.push({
          name: 'collection',
          value: program.opts().collection
        });
        options.push({
          name: 'project',
          value: program.opts().project
        });

        const inputs: Input[] = [];
        inputs.push({ name: 'schematic', value: schematic });
        inputs.push({ name: 'name', value: name });
        inputs.push({ name: 'path', value: path });

        // 获取 schema.json
        const schema = await this.getSchema(schematic);

        // 询问缺少的必填字段
        const missingOptions = await this.promptForMissingOptions(schema, inputs);

        // 将结果合并到 options 中
        Object.keys(missingOptions).forEach(key => {
          options.push({ name: key, value: missingOptions[key] });
        });

        await this.action.handle(inputs, options);
      });
  }

  protected async buildDescription(): Promise<string> {
    const collection = await this.getCollection();
    return (
      'Generate a iCodeX element.\n' +
      `  Schematics available on ${chalk.bold(collection)} collection:\n` +
      this.buildSchematicsListAsTable(await this.getSchematics(collection))
    );
  }

  private buildSchematicsListAsTable(schematics: Schematic[]): string {
    const leftMargin = '    ';
    const tableConfig = {
      head: ['name', 'alias', 'description'],
      chars: {
        left: leftMargin.concat('│'),
        'top-left': leftMargin.concat('┌'),
        'bottom-left': leftMargin.concat('└'),
        mid: '',
        'left-mid': '',
        'mid-mid': '',
        'right-mid': ''
      }
    };
    const table: any = new Table(tableConfig);
    for (const schematic of schematics) {
      table.push([chalk.green(schematic.name), chalk.cyan(schematic.alias), schematic.description]);
    }
    return table.toString();
  }

  private async getCollection(): Promise<string> {
    const configuration = await loadConfiguration();

    return configuration.collection;
  }

  private async getSchematics(collection: string): Promise<Schematic[]> {
    const abstractCollection: AbstractCollection = CollectionFactory.create(collection);

    return abstractCollection.getSchematics();
  }

  private async getSchema(schematic: string): Promise<any> {
    // 获取 @icodex/schematics 包的路径
    const packagePath = require.resolve(`@icodex/schematics`);

    // 构建 collection.json 的路径
    const collectionPath = path.resolve(packagePath, '../../src/collection.json');

    // 检查 collection.json 文件是否存在
    if (!fs.existsSync(collectionPath)) {
      throw new Error(`Collection file not found at ${collectionPath}`);
    }

    // 读取并解析 collection.json 文件
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));

    // 查找对应的 schematic 或别名
    const schematicConfig =
      collection.schematics[schematic] ||
      Object.values(collection.schematics).find((config: any) => config.aliases?.includes(schematic));

    if (!schematicConfig) {
      throw new Error(`Schematic or alias "${schematic}" not found in collection.`);
    }

    // 从 schema 字段推断 schema.json 的路径
    const schemaPath = path.resolve(packagePath, '../../src', schematicConfig.schema);

    // 检查 schema.json 文件是否存在
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema for schematic "${schematic}" not found at ${schemaPath}`);
    }

    // 读取并解析 schema.json 文件
    return JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  }

  private async promptForMissingOptions(schema: any, currentOptions: Input[]) {
    const questions: (UnnamedDistinctQuestion<{
      [x: string]: any;
    }> & {
      name: string;
    })[] = [];

    // 遍历 schema 中的 properties
    for (const [key, value] of Object.entries(schema.properties) as [string, any][]) {
      // 如果当前字段没有提供且是必填项
      if (!currentOptions.find(option => option.name === key) && schema.required?.includes(key)) {
        // 检查是否有枚举选项
        if (value.enum) {
          questions.push({
            type: 'list',
            name: key,
            message: value['x-prompt'] || `Please select a value for ${key}:`,
            choices: value.enum,
            default: value.default || undefined
          });
        } else {
          questions.push({
            type: 'input',
            name: key,
            message: value['x-prompt'] || `Please provide a value for ${key}:`,
            validate: (input: string) => (input ? true : `${key} is required`),
            default: value.default || undefined
          });
        }
      }
    }

    if (questions.length > 0) {
      return await inquirer.prompt(questions);
    }
    return {};
  }
}
