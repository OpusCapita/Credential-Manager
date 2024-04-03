import { checkIfTypeIsString } from "../../../_common/utils/Request.utils";
import { checkReceivingRequestBodyParamsForGet } from '../../../_common/utils/ReceivingRequest.utils';

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';

export const getReceive = async (req: HttpRequest) => {
    const { uuid } = req.body;

    try {
        // Chack body params
        checkReceivingRequestBodyParamsForGet(uuid);

        // Check connection
        checkIfTypeIsString(uuid, 'uuid');

        // Check if row with uuid already exists
        const response_from_db = await ReceivingCredential.get(uuid);

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Not found',
                    description: "Username not found."
                }
            };
        }

        return {
            status: 200,
            body: {
                status: 'OK',
                payload: response_from_db
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
            }
        };
    }
}
