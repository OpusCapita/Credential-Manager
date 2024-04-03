import { returnRequiredParamsErrorMessage } from '../../_common/utils/Request.utils';

export const checkFetchingRequestBodyParamsForDelete = (id_connection: string) => {
    if (!id_connection) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['id_connection'], 'body')
            }
        };
    }
}

export const checkFetchingRequestBodyParamsForCreateOrUpdate = (id_connection: string, password: string) => {
    if (!id_connection || !password) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['id_connection', 'password'], 'body')
            }
        };
    }
}

export const checkFetchingRequestQueryParamsForGetOrDelete = (id_connection: string) => {
    if (!id_connection) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['id_connection'], 'query')
            }
        };
    }
}