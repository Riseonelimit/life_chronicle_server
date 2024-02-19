// Todo: make generic error class

class Error{
    constructor(statusCode,errorMessage){
        this.status = statusCode
        this.message = errorMessage
        this.success = false
    }
}