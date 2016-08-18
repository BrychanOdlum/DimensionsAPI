process.env.MONGO_URL = 'mongodb://localhost:27017/dimensions';


//require('./app/core/mongoose')
require('./app/core/mysql')
require('./app/core/router')
