type RequestParamsType = 'body' | 'query';

export const returnRequiredParamsErrorMessage = (params: Array<string>, source: RequestParamsType) => `Missing some required ${source.toString()} params ( check: ${params.join(', ')} ).`;


/**
 * Checks if a value is of type string and throws an error if it's not.
 * @param value - The value to check.
 * @param field_name - The name of the field being checked (used in the error message).
 * @throws Throws a 400 Bad Request error if the value is not a string.
 */
export const checkIfTypeIsString = (value: any, field_name: string) => {
    if (typeof value !== 'string') {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                field_name: field_name,
                description: `Invalid data format: ${field_name} must be a string.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

/**
 * Checks if the request body exists.
 * @param body - The request body.
 * @throws Throws an error if the request body is missing.
 */
export const checkIfRequestBodyExists = (body: any) => {
    if (!body) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: 'Request body is missing.'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

/**
 * Checks if the given value is a number.
 * @param value - The value to check.
 * @param field_name - The name of the field being checked.
 * @throws Throws an error with status 400 if the value is not a number.
 */
export const checkIfTypeIsNumber = (value: any, field_name: string) => {
    if (typeof value !== 'number') {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                field_name: field_name,
                description: `Invalid data format: ${field_name} must be a number.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

/**
 * Checks if a value is a positive integer.
 * @param value - The value to be checked.
 * @param field_name - The name of the field being checked.
 * @throws Throws an error if the value is not a positive integer.
 */
export const checkIfPositiveIntegerStringOrNumber = (value: any, field_name: string) => {
    value = Number(value);

    if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value) || value < 1) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                field_name: field_name,
                description: `Invalid data format: ${field_name} must be a positive integer.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

/**
 * Checks if a value is a positive integer.
 * @param value - The value to be checked.
 * @param field_name - The name of the field being checked.
 * @throws Throws an error if the value is not a positive integer.
 */
export const checkIfPositiveIntegerNumber = (value: any, field_name: string) => {
    if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value) || value < 1) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                field_name: field_name,
                description: `Invalid data format: ${field_name} must be a positive integer.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
