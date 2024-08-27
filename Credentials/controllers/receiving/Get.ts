import { checkIfPositiveIntegerStringOrNumber, checkIfTypeIsString } from "../../../_common/utils/Request.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestQueryParamsForGet } from '../../../_common/utils/ReceivingRequest.utils';

export const getReceive = async (req: HttpRequest) => {
    const { id_account, uuid } = req.query;

    let response_from_db

    try {
        if (uuid) {
            // Check if uuid is a string
            checkIfTypeIsString(uuid, 'uuid');

            // Check if row with id_account already exists
            response_from_db = await ReceivingCredential.getUUID(uuid);
        }
        else {
            // Chack body params
            checkReceivingRequestQueryParamsForGet(id_account);

            checkIfPositiveIntegerStringOrNumber(id_account, 'id_account');

            // Check if row with id_account already exists
            response_from_db = await ReceivingCredential.get(Number(id_account));
        }

        if (!response_from_db) {
            const property_name = uuid ? 'uuid' : 'id_account';

            return {
                status: 404,
                body: {
                    status: 'Not found',
                    field_name: property_name,
                    description: `Resource with the provided ${property_name} does not exist.`
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
