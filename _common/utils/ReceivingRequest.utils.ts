import { returnRequiredParamsErrorMessage } from './Request.utils';

export const checkReceivingRequestQueryParamsForGet = (id_account: string) => {
    if (!id_account) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['id_account'], 'query')
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

export const checkReceivingRequestBodyParamsForDelete = (id_account: string) => {
    if (!id_account) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['id_account'], 'body')
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

export const checkReceivingRequestBodyParamsForCreateOrUpdate = (uuid: string, username: string, id_account: number) => {
    if (!uuid || !username || !id_account) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                description: returnRequiredParamsErrorMessage(['uuid', 'username, id_account'], 'body')
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

export const throwIfDuplicateObject = (response: any[], field: string, value: string | number, id_account: number) => {
    const duplicateObject = response.find(obj => obj[field] === value && obj.id_account !== id_account);

    if (duplicateObject) {
        throw {
            status: 400,
            body: {
                status: 'Bad Request',
                field_name: field,
                description: `An object with the same ${field} but a different id_account already exists.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}
