import { Runner, RunnerFactory } from '../runners';
import { SchematicRunner } from '../runners/schematic.runner';
import { AbstractCollection } from './abstract.collection';
import { Collection } from './collection';
import { IMeanCollection } from './imean.collection';

export class CollectionFactory {
  public static create(collection: Collection | string): AbstractCollection {
    const schematicRunner = RunnerFactory.create(Runner.SCHEMATIC) as SchematicRunner;

    return new IMeanCollection(schematicRunner);
  }
}
