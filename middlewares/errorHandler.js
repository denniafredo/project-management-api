function errorHandler(err, req, res, next){
    let error = err.msg || err.message
    res.status(err.code || 500).json({message:error})
}

module.exports = errorHandler