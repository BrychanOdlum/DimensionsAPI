var mysql = require('mysql');

var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'dimensions',
	password: 'YYv6FAdVATd7rgK7GWFg4gPx',
	database: 'dimensions',
	port: 3307,
	connectionLimit: 10
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
