const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/error-handlers/app-error');
const AuthHelpers = require('../utils/helpers/auth-helpers');
const { ErrorResponse } = require('../utils/responses');
const dotenv = require('dotenv');
dotenv.config();

const { AUTH_SERVICE_URL } = process.env;

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];

        if (!token) {
            const error = new AppError(
                                        'ClientSideError',
                                        ['missing authentication token', 'the client is not signed in'],
                                        StatusCodes.UNAUTHORIZED
                                      );

            ErrorResponse.message = error.message;
            ErrorResponse.error = error;
            return res
                    .status(error.statusCode)
                    .json(ErrorResponse);
        }
        
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/isAuthenticated`, {
            headers: {
                'x-access-token': token,
            },
        });

        // handle unsuccessful responses received from the auth service
        /* response.data
            {
                success: false,
                message: 'jwt expired'
                data: {},
                error: {}
            }
        */
        if(!response.data.success) {
            ErrorResponse = AuthHelpers.handleUnsuccessfulAuthResponse(response.data);
            return res
                    .status(ErrorResponse.error.statusCode)
                    .json(ErrorResponse);
        }

        // appending userId returned by /isAuthenticated to req object
        req.user = { id: response.data.data }; 

        if (response.data.success && response.status === 200) {
            return next();
        }

        ErrorResponse.message = "invalid authentication token";
        ErrorResponse.error = new AppError();
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(ErrorResponse);

    } catch (error) {
        ErrorResponse.error = error;
        ErrorResponse.message = "authentication service unavailable"
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

module.exports = {
    isAuthenticated
};