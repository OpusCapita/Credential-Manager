import { checkIfTypeIsString } from "../../../_common/utils/Request.utils";
import { checkFetchingRequestQueryParamsForGetOrDelete } from "../../../_common/utils/FetchingRequest.utils";

import Credential from '../../../_common/models/Credential.model';
import { HttpRequest } from "@azure/functions";
import { throwIfDatabaseResourceNotExists } from "../../../_common/utils/DatabaseResponse.utils";

export const get = async (req: HttpRequest) => {
    const { id_connection } = req.query;

    // Chack body params
    checkFetchingRequestQueryParamsForGetOrDelete(id_connection);

    // Check connection
    checkIfTypeIsString(id_connection, 'id_connection');

    // Check if row with id_connection already exists
    const response_from_db = await Credential.get(id_connection);

    // If not exists throw error 404 - Not found
    throwIfDatabaseResourceNotExists(response_from_db, 'id_connection');

    return {
        status: 200,
        body: {
            status: 'OK',
            payload: response_from_db
        }
    };
}