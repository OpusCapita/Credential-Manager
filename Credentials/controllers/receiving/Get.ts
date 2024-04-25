import { checkIfPositiveInteger } from "../../../_common/utils/Request.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestQueryParamsForGet } from '../../../_common/utils/ReceivingRequest.utils';

export const getReceive = async (req: HttpRequest) => {
    const { id_account } = req.query;

    try {
        // Chack body params
        checkReceivingRequestQueryParamsForGet(id_account);

        checkIfPositiveInteger(id_account, 'id_account');

        // Check if row with id_account already exists
        const response_from_db = await ReceivingCredential.get(Number(id_account));

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Not found',
                    field_name: 'id_account',
                    description: 'Resource with the provided id_account does not exist.'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        return {
            status: 200,
            body: {
                status: 'OK',
                payload: response_from_db
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    catch (error) {
        if (error.status) {
            return error;
        }

        return {
            status: 500,
            body: {
                status: 'Internal error',
                description: 'An unexpected error occurred. Please try again later.'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}
