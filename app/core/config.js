var fs = require('fs')
var config = JSON.parse(fs.readFileSync(process.cwd() + '/config.json', 'utf8'));

module.exports = config;
