var restify = require('restify')
var fs = require('fs')
var logger  = require('morgan')
var controllersPath = process.cwd() + '/app/controllers'


//Lets fetch our controllers
var controllers = {mc: {},cp: {}}
fs.readdirSync(process.cwd() + '/app/mc/controllers/').forEach(function(file) {
	controllers.mc[file.split('.')[0]] = require(process.cwd() + '/app/mc/controllers/' + file)
})
fs.readdirSync(process.cwd() + '/app/cp/controllers/').forEach(function(file) {
	controllers.cp[file.split('.')[0]] = require(process.cwd() + '/app/cp/controllers/' + file)
})

// Create server
var server = restify.createServer()
server
	.use(restify.fullResponse())
	.use(restify.bodyParser())
	.use(restify.queryParser())
	.use(logger('dev'))
	.use(require(process.cwd() + '/app/core/utils/authentication').authenticate)
	.use(require(process.cwd() + '/app/core/utils/parser').parse)


// MC REQUESTS
server.get("/mc/node/initiate", controllers.mc.node.initiate)
server.get("/mc/node/verify", controllers.mc.node.verify)
server.get("/mc/account/initiate", controllers.mc.account.initiate)
server.get("/mc/account/register", controllers.mc.account.register)
server.get("/mc/account/login", controllers.mc.account.login)
server.get("/mc/account/password", controllers.mc.account.setPassword)
server.get("/mc/account/disconnect", controllers.mc.account.disconnct)


// CP REQUESTS


// ERRORS
server.on('BadRequest', controllers.mc.errors.badRequest);
server.on('NotFound', controllers.mc.errors.notFound);




// Server to listen on port, start accepting requests
var port = process.env.PORT || 3000
server.listen(port, function(err) {
	if (err)
		console.error(err)
	else
		console.log('API loaded on :' + port)
})


// If we're in production then lets throw some nicely formatted errors and not crash everything.

if (process.env.environment != 'test') {
	process.on('uncaughtException', function(err) {
		console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
	})
}
