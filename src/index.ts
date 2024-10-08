#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "child_process";
import pkg from "../package.json";

const program = new Command(pkg.name);

program.version(pkg.version);
program.description(pkg.description);

program.parse(process.argv);
