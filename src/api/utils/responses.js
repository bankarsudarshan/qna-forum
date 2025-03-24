const error = {
    success: false,
    message: 'Something went wrong',
    data: {},
    error: {},
};

const success = {
    success: true,
    message: 'Request proccessed successfully',
    data: {},
    error: {},
};

module.exports = {
    ErrorResponse: error,
    SuccessResponse: success,
}