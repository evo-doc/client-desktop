#! /usr/bin/env node

// Modules
const fs = require('fs');
const path = require('path');
const config = require('../package.json');

// Rewrite configuration
delete config.scripts;
config.main = './electron.config.js';

// Save
fs.writeFileSync(path.join(__dirname, '../build/package.json'), JSON.stringify(config));
