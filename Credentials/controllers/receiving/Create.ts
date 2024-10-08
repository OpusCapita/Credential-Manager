import { checkIfPositiveIntegerNumber, checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestBodyParamsForCreateOrUpdate } from '../../../_common/utils/ReceivingRequest.utils';
import { throwIfDatabaseResourceExists } from "../../../_common/utils/DatabaseResponse.utils";

export const createReceive = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { uuid, username, id_account } = req.body;

    // Chack body params
    checkReceivingRequestBodyParamsForCreateOrUpdate(uuid, username, id_account);

    checkIfPositiveIntegerNumber(id_account, 'id_account');

    checkIfTypeIsString(uuid, 'uuid');

    checkIfTypeIsString(username, 'username');

    // Check if row with id_account already exists
    let response_from_db = await ReceivingCredential.get(id_account);

    // If exists throw error 409 - Conflict
    throwIfDatabaseResourceExists(response_from_db, 'id_account');

    // Check if row with uuid already exists
    response_from_db = await ReceivingCredential.getUUID(uuid);

    // If exists throw error 409 - Conflict
    throwIfDatabaseResourceExists(response_from_db, 'uuid');

    // Check if row with uuid already exists
    response_from_db = await ReceivingCredential.getUsername(username);

    // If exists throw error 409 - Conflict
    throwIfDatabaseResourceExists(response_from_db, 'username');

    await ReceivingCredential.create(id_account, uuid, username);

    return {
        status: 201,
        body: {
            status: 'Created',
            description: 'New resource created successfully.'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
