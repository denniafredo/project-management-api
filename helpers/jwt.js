const jwt = require('jsonwebtoken')
module.exports = {
    generate (payload) {
        return jwt.sign(payload, process.env.SECRET, {expiresIn: '1d'})
    }, 
    verify (token) {
        return jwt.verify(token, process.env.SECRET)
    }
}