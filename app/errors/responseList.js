exports.responseList = (code, message) => {
    let list = {
        200: {
            error: 0,
            code: 200,
            info: 'Request successful.',
        },
        400: {
            error: 1,
            code: 400,
            info: 'Bad Request',
        },
        401: {
            error: 1,
            code: 401,
            info: 'Unauthorized',
        },
        402: {
            error: 1,
            code: 402,
            info: 'Payment Required - This endpoint only for paid users.',
        },
        403: {
            error: 1,
            code: 403,
            info: 'Forbidden',
        },
        404: {
            error: 1,
            code: 404,
            info: 'No such route',
        },
        422: {
            error: 1,
            code: 422,
            info: 'Unprocessable Entity',
        },
        429: {
            error: 1,
            code: 429,
            info: 'Rate limit exceeded',
        },
        204: {
            error: 1,
            code: 429,
            info: 'Deletion successful.',
        },
        500: {
            error: 1,
            code: 500,
            info: 'Server error',
        },
    };

    if (message !== undefined) {
        list[code].info = message;
    }

    return list[code];
};
