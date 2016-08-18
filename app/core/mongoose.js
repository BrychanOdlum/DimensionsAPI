var mongoose = require('mongoose')
var fs = require('fs')
var modelsPath = process.cwd() + '/app/models'
var config = require(process.cwd() + '/app/core/config').data.mongodb;

mongoose.connect(config.host, {server:{auto_reconnect:true}})
var db = mongoose.connection

db.on('error', function(err) {
	console.error('MongoDB connection error:', err)
})
db.on('open', function(err) {
	console.log('MongoDB connected')
})
db.on('disconnected', function(err) {
	console.log('MongoDB disconnected')
})
db.on('reconnected', function(err) {
	console.log('MongoDB reconnected')
})

fs.readdirSync(modelsPath).forEach(function(file) {
	if (~file.indexOf('.js')) {
		require(modelsPath + '/' + file)
	}
})
