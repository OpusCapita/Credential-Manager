import { checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";
import { checkFetchingRequestBodyParamsForDelete } from "../../../_common/utils/FetchingRequest.utils";

import Credential from '../../../_common/models/Credential.model';
import { HttpRequest } from "@azure/functions";
import { throwIfDatabaseResourceNotExists } from "../../../_common/utils/DatabaseResponse.utils";

export const remove = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { id_connection } = req.body;

    // Chack body params
    checkFetchingRequestBodyParamsForDelete(id_connection);

    // Check connection
    checkIfTypeIsString(id_connection, 'id_connection');

    // Check if row with id_connection already exists
    let response_from_db = await Credential.get(id_connection.toString());

    // If not exists throw error 404 - Not found
    throwIfDatabaseResourceNotExists(response_from_db, 'id_connection');

    await Credential.delete(response_from_db);

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource deleted successfully.'
        }
    };
}
