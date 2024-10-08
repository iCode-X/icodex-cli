import { AbstractRunner } from '../runners';
import { AbstractCollection } from './abstract.collection';
import { SchematicOption } from './schematic.option';

export interface Schematic {
  name: string;
  alias: string;
  description: string;
}

export class IMeanCollection extends AbstractCollection {
  private static schematics: Schematic[] = [
    {
      name: 'component',
      alias: 'cmp',
      description: 'Generate a new component'
    }
  ];

  constructor(runner: AbstractRunner) {
    super('@imean/schematics', runner);
  }

  public async execute(name: string, options: SchematicOption[]) {
    const schematic: string = this.validate(name);
    await super.execute(schematic, options);
  }

  public getSchematics(): Schematic[] {
    return IMeanCollection.schematics;
  }

  private validate(name: string) {
    const schematic = IMeanCollection.schematics.find(s => s.name === name || s.alias === name);

    if (schematic === undefined || schematic === null) {
      throw new Error(`Invalid schematic "${name}". Please, ensure that "${name}" exists in this collection.`);
    }
    return schematic.name;
  }
}
