#! /usr/bin/env node
import fs from 'fs';

import { diarySetup } from './cli/diarySetup';
import { configPath } from './util/directories';
import { newEntry } from './cli/newEntry';


if(!fs.existsSync(configPath)) {
    diarySetup();
} else {
    newEntry();
}