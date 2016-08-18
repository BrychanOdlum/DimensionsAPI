var restify = require('restify')
var fs = require('fs')
var logger  = require('morgan')
var controllersPath = process.cwd() + '/app/controllers'


//Lets fetch our controllers
var controllers = {}
fs.readdirSync(controllersPath).forEach(function(file) {
	if (~file.indexOf('.js')) {
		controllers[file.split('.')[0]] = require(controllersPath + '/' + file)
	}
})


// Create server
var server = restify.createServer()
server
	.use(restify.fullResponse())
	.use(restify.bodyParser())
	.use(restify.queryParser())
	.use(logger('dev'))




// USER REQUESTS
server.get("/account/initiate", controllers.account.accountInitiate)

server.post("/account", controllers.account.createAccount)
server.get("/account/:id", controllers.account.viewAccount)
server.put("/account/:id", controllers.account.updateAccount)
server.del("/account/:id", controllers.account.deleteAccount)


// DIMENSION REQUESTS


// ERRORS
server.on('BadRequest', controllers.errors.badRequest);
server.on('NotFound', controllers.errors.notFound);




// Server to listen on port, start accepting requests
var port = process.env.PORT || 3000
server.listen(port, function(err) {
	if (err)
		console.error(err)
	else
		console.log('API loaded on :' + port)
})


// If we're in production then lets through some nicely formatted errors and not crash everything.
if (process.env.environment == 'production') {
	process.on('uncaughtException', function(err) {
		console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
	})
}
