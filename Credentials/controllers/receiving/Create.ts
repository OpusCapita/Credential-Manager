import { checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestBodyParamsForCreateOrUpdate } from '../../../_common/utils/ReceivingRequest.utils';
import { throwIfDatabaseResourceExists } from "../../../_common/utils/DatabaseResponse.utils";

export const createReceive = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { uuid, username } = req.body;

    // Chack body params
    checkReceivingRequestBodyParamsForCreateOrUpdate(uuid, username);

    // Check uuid
    checkIfTypeIsString(uuid, 'uuid');

    // Check username
    checkIfTypeIsString(username, 'username');

    // Check if row with uuid already exists
    const response_from_db = await ReceivingCredential.get(uuid);

    // If exists throw error 409 - Conflict
    throwIfDatabaseResourceExists(response_from_db, 'uuid');

    await ReceivingCredential.create(uuid, username);

    return {
        status: 201,
        body: {
            status: 'Created',
            description: 'New resource created successfully.'
        }
    };
}
