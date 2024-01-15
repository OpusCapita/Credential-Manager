type RequertParamsType = 'body' | 'query';

const returnRequiredParamsErrorMessage = (params: Array<string>, source: RequertParamsType) => `Missing some required ${source.toString()} params ( check: ${params.join(', ')} ).`;

export const checkRequestQueryParamsForDelete = (id_connection: string) => {
    if (!id_connection) {
        throw {
            status: 400,
            body: {
                status: 'Error',
                description: returnRequiredParamsErrorMessage(['id_connection'], 'query')
            }
        };
    }
}

export const checkRequestBodyParamsForCreateOrUpdate = (id_connection: string, password: string) => {
    if (!id_connection || !password) {
        throw {
            status: 400,
            body: {
                status: 'Error',
                description: returnRequiredParamsErrorMessage(['id_connection', 'password'], 'body')
            }
        };
    }
}

export const checkRequestQueryParamsForGetOrRemove = (id_connection: string) => {
    if (!id_connection) {
        throw {
            status: 400,
            body: {
                status: 'Error',
                description: returnRequiredParamsErrorMessage(['id_connection'], 'body')
            }
        };
    }
}

export const checkRequestBodyParamsForGet = (uuid: string) => {
    if (!uuid) {
        throw {
            status: 400,
            body: {
                status: 'Error',
                description: returnRequiredParamsErrorMessage(['uuid'], 'body')
            }
        };
    }
}

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
                status: 'Error',
                description: `Invalid data format: ${field_name} must be a string.`
            }
        };
    }
};
