#! /usr/bin/env node
import fs from 'fs';

import { runDiarySetup } from './functions/runDiarySetup';
import { configPath } from './util/directories';


if(!fs.existsSync(configPath)) {
    runDiarySetup();
}