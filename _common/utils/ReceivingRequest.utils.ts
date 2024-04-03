import { returnRequiredParamsErrorMessage } from './Request.utils';

export const checkReceivingRequestBodyParamsForGet = (uuid: string) => {
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

