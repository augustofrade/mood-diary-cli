#! /usr/bin/env node
import fs from 'fs';

import { diarySetup } from './cli/diarySetup';
import { configPath } from './util/directories';


if(!fs.existsSync(configPath)) {
    diarySetup();
} else {
    
}