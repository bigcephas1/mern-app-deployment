// creating a customer eror handler allows you to use the throw new Error and message instead of using the default html page handler
const notFound = (req, res, next) => {
    const error = new Error(`not Found -${req.originalUrl}`)
    res.status(404)
    next(error)
}
const errorHandler = (err, req, res, next) => {
    // throwing your own error the statusCode might still be 200 so that's why we changed the statusCode to 500 if it is 200 else use whatever the statusCode is
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message
    if (err.name === 'castError' && err.kind === 'ObjectId') {
        statusCode = 404
        message = "resource not found"
        
    }
    res.status(statusCode).json({
        message,
        // stack means if it is in production show null else show the err stak, error stack means the line of the error
        stack: process.env.NODE_ENV === 'production : null : err.stack'
    })
}
export {notFound,errorHandler}