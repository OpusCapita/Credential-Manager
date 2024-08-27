import { checkIfPositiveIntegerNumber, checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";
import { checkReceivingRequestBodyParamsForCreateOrUpdate, throwIfDuplicateObject } from "../../../_common/utils/ReceivingRequest.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';

export const updateReceive = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { uuid, username, id_account } = req.body;

    // Chack body params
    checkReceivingRequestBodyParamsForCreateOrUpdate(uuid, username, id_account);

    // Check connection
    checkIfTypeIsString(uuid, 'uuid');

    // Check username
    checkIfTypeIsString(username, 'username');

    // Check id_account is positive integer
    checkIfPositiveIntegerNumber(id_account, 'id_account');

    // Check if row with id_account already exists
    let response_from_db = await ReceivingCredential.get(id_account);

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
        }
    }
    else {
        // Check if username or uuid already exists
        const response = await ReceivingCredential.getByUUIDOrUsername(uuid, username);

        throwIfDuplicateObject(response, 'uuid', uuid, id_account);
        throwIfDuplicateObject(response, 'username', username, id_account);

        // Update object properties
        response_from_db.username = username;
        response_from_db.uuid = uuid;
        response_from_db.updated_at = new Date().toISOString();

        await ReceivingCredential.update(response_from_db);
    }

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource updated successfully.'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
