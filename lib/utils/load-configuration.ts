import { Configuration, ConfigurationLoader, IMeanConfigurationLoader } from '../configuration';
// import { NestConfigurationLoader } from '../configuration/nest-configuration.loader';
import { FileSystemReader } from '../readers';

export async function loadConfiguration(): Promise<Required<Configuration>> {
  const loader: ConfigurationLoader = new IMeanConfigurationLoader(new FileSystemReader(process.cwd()));
  return loader.load();
}
