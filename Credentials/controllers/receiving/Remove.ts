import { checkIfTypeIsNumber, checkIfTypeIsString } from '../../../_common/utils/Request.utils';

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestBodyParamsForDelete } from "../../../_common/utils/ReceivingRequest.utils";

export const removeReceive = async (req: HttpRequest) => {
    const { id_account } = req.body;

    try {
        // Chack body params
        checkReceivingRequestBodyParamsForDelete(id_account);

        checkIfTypeIsNumber(id_account, 'id_account');

        // Check if row with id_account already exists
        let response_from_db = await ReceivingCredential.get(Number(id_account));

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Not found',
                    description: 'Resource with the provided id_account does not exist.'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }

        await ReceivingCredential.delete(response_from_db);
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

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource deleted successfully.'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
