var bcrypt = require('bcrypt')

console.log("test...")
var hash = bcrypt.hashSync("test", 12)

console.log(hash)
