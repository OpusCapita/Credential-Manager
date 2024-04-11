import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkIfTypeIsString } from '../../../_common/utils/Request.utils';
import { checkReceivingRequestBodyParamsForDelete } from "../../../_common/utils/ReceivingRequest.utils";

export const removeReceive = async (req: HttpRequest) => {
    const { uuid } = req.body;

    try {
        // Chack body params
        checkReceivingRequestBodyParamsForDelete(uuid);

        // Check connection
        checkIfTypeIsString(uuid, 'uuid');

        // Check if row with uuid already exists
        let response_from_db = await ReceivingCredential.get(uuid.toString());

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Not found',
                    description: 'Resource with the provided id_connection does not exist.'
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
            }
        };
    }

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource deleted successfully.'
        }
    };
}
