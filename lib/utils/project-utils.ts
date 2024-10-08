import { ProjectConfiguration } from '../configuration';

export function shouldAskForProject(
  schematic: string,
  configurationProjects: { [key: string]: ProjectConfiguration },
  appName: string
) {
  return (
    ['app', 'sub-app', 'library', 'lib'].includes(schematic) === false &&
    configurationProjects &&
    Object.entries(configurationProjects).length !== 0 &&
    !appName
  );
}
