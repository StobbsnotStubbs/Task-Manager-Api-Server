const errorHandler = (error, req, res, next) => {
    console.log(error)
   
    res.status(500).send({
        code: 500,
        route: req.path,
        message: `Server Error: ${error.message || error}`
    });
}

module.exports = errorHandler;