import chalk from 'chalk';
import { Input } from '../../commands';
import { getValueOrDefault } from '../../lib/compiler/helpers/get-value-or-default';
import { AbstractCollection } from '../../lib/schematics/abstract.collection';
import { Collection } from '../../lib/schematics/collection';
import { CollectionFactory } from '../../lib/schematics/collection.factory';
import { SchematicOption } from '../../lib/schematics/schematic.option';
import { loadConfiguration } from '../../lib/utils/load-configuration';
import { shouldAskForProject } from '../../lib/utils/project-utils';
import { AbstractAction } from '../abstract.action';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    await generateFiles(inputs.concat(options));
  }
}

const generateFiles = async (inputs: Input[]) => {
  const configuration = await loadConfiguration();

  const collectionOption = inputs.find(input => input.name === 'collection')?.value as string | undefined;
  const schematic = inputs.find(input => input.name === 'schematic')!.value as string;
  const appName = inputs.find(input => input.name === 'project')!.value as string;

  const collection: AbstractCollection = CollectionFactory.create(
    collectionOption || configuration.collection || Collection.ICodeX
  );
  const schematicOptions: SchematicOption[] = mapSchematicOptions(inputs);
  const configurationProjects = configuration.projects;

  let sourceRoot = appName ? getValueOrDefault(configuration, 'sourceRoot', appName) : configuration.sourceRoot;

  if (shouldAskForProject(schematic, configurationProjects, appName)) {
    console.log('Please provide a project name');
  }

  schematicOptions.push(new SchematicOption('sourceRoot', sourceRoot));

  try {
    const schematicInput = inputs.find(input => input.name === 'schematic');
    if (!schematicInput) {
      throw new Error('Unable to find a schematic for this configuration');
    }
    await collection.execute(schematicInput.value as string, schematicOptions);
  } catch (error) {
    if (error && error.message) {
      console.error(chalk.red(error.message));
    }
  }
};

const mapSchematicOptions = (inputs: Input[]): SchematicOption[] => {
  const excludedInputNames = ['schematic'];
  const options: SchematicOption[] = [];
  inputs.forEach(input => {
    if (!excludedInputNames.includes(input.name) && input.value !== undefined) {
      options.push(new SchematicOption(input.name, input.value));
    }
  });
  return options;
};
