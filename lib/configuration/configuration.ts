export interface CompilerOptions {
  tsConfigPath?: string;
  /**
   * @deprecated Use `builder` instead.
   */
  webpack?: boolean;
  /**
   * @deprecated Use `builder.options.configPath` instead.
   */
  webpackConfigPath?: string;
  assets?: string[];
  deleteOutDir?: boolean;
  manualRestart?: boolean;
}

export interface ProjectConfiguration {
  // type?: string;
  // root?: string;
  // entryFile?: string;
  // exec?: string;
  // sourceRoot?: string;
  // compilerOptions?: CompilerOptions;
}

export interface Configuration {
  [key: string]: any;
  language?: string;
  sourceRoot?: string;
  collection?: string;
  projects?: {
    [key: string]: ProjectConfiguration;
  };
}
