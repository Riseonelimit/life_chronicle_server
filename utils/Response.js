// Todo: make generic response class 

exports.Response = class {
    constructor(statusCode = 500, responseMessage = null, resData = null){
        this.status = statusCode
        this.message = responseMessage
        this.data = resData
        this.success = false
    }
}

