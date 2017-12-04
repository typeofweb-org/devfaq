global.Promise = require('bluebird');
require('dotenv').config()
require('ts-node').register();

require('./app/index');
