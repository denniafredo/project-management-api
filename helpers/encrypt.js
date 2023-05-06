const bcrypt = require('bcryptjs')
module.exports = {
    encrypt (pass) {
        let salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(pass, salt)
    },
    compare (pass, encrypted) {
        return bcrypt.compareSync(pass, encrypted)
    }
}