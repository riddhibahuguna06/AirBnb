class ExpressError extends Error{
    constructor(statusCode , message){
        super();
        this.statusCodec = statusCode ;
        this.message = message;
    }
}

module.exports = ExpressError ;