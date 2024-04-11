import { checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";

import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';
import { checkReceivingRequestBodyParamsForCreateOrUpdate } from "../../../_common/utils/ReceivingRequest.utils";
import { throwIfDatabaseResourceNotExists } from "../../../_common/utils/DatabaseResponse.utils";

export const updateReceive = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { uuid, username } = req.body;

    // Chack body params
    checkReceivingRequestBodyParamsForCreateOrUpdate(uuid, username);

    // Check connection
    checkIfTypeIsString(uuid, 'uuid');

    // Check username
    checkIfTypeIsString(username, 'username');

    // Check if row with uuid already exists
    let response_from_db = await ReceivingCredential.get(uuid.toString());

    // If not exists throw error 404 - Not found
    throwIfDatabaseResourceNotExists(response_from_db, 'uuid');

    // Update object properties
    response_from_db.username = username;
    response_from_db.updated_at = new Date().toISOString();

    await ReceivingCredential.update(response_from_db);

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource updated successfully.'
        }
    };
}
