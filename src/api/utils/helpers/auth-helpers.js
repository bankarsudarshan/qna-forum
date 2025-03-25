const { StatusCodes } = require("http-status-codes");
const AppError = require("../error-handlers/app-error");

const handleUnsuccessfulAuthResponse = (authServiceResponse) => {

    try {
        if (authServiceResponse.success) {
            throw new AppError("wth!? error from unsuccessfulAuthResponseHandler auth-helper", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    
        if (authServiceResponse.error.name === "TokenExpiredError") {
            return {
                success: authServiceResponse.success,
                message: `auth service says - ${authServiceResponse.message}\nthe status code in error message is 'OK 200', because it was a successful request-reply cycle`,
                data: {},
                error: authServiceResponse.error,
            };
        }
    
        // Handle other error cases explicitly
        return {
            success: false,
            message: "Authentication failed",
            data: {},
            error: authServiceResponse.error || { message: "Unknown error" }
        };
    } catch (error) {
        console.log('inside the catch block of auth helper')
    }

};

module.exports = {
    handleUnsuccessfulAuthResponse,
};
