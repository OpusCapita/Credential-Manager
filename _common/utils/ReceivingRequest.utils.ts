import { returnRequiredParamsErrorMessage } from './Request.utils';

export const checkReceivingRequestQueryParamsForGet = (uuid: string) => {
    if (!uuid) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['uuid'], 'query')
            }
        };
    }
}

export const checkReceivingRequestBodyParamsForDelete = (uuid: string) => {
    if (!uuid) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['uuid'], 'body')
            }
        };
    }
}

export const checkReceivingRequestBodyParamsForCreateOrUpdate = (uuid: string, username: string) => {
    if (!uuid || !username) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['uuid', 'username'], 'body')
            }
        };
    }
}
