var mysql = require('mysql');
var fs = require('fs')
var config = require(process.cwd() + '/app/core/config').data.mysql;

var pool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database,
	port: config.port,
	connectionLimit: config.connectionLimit
})

exports.query = function(sql, values, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log("MySQL error: " +err);
			callback(true);
			return;
		}
		connection.query(sql, values, callback)
		connection.release();
	})
}
