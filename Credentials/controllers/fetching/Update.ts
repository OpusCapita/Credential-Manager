import { checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";
import { checkFetchingRequestBodyParamsForCreateOrUpdate } from "../../../_common/utils/FetchingRequest.utils";

import Credential from '../../../_common/models/Credential.model';
import { HttpRequest } from "@azure/functions";
import { Password } from "../../models/Password";
import { throwIfDatabaseResourceNotExists } from "../../../_common/utils/DatabaseResponse.utils";

export const update = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { id_connection, password } = req.body;

    // Chack body params
    checkFetchingRequestBodyParamsForCreateOrUpdate(id_connection, password);

    // Check connection
    checkIfTypeIsString(id_connection, 'id_connection');

    // Check password
    checkIfTypeIsString(password, 'password');

    const encrypt_password = Password.encryptPassword(password);

    // Check if row with id_connection already exists
    let response_from_db = await Credential.get(id_connection.toString());

    // If not exists throw error 404 - Not found
    throwIfDatabaseResourceNotExists(response_from_db, 'id_connection');

    // Update object properties
    response_from_db.password = encrypt_password;
    response_from_db.updated_at = new Date().toISOString();

    await Credential.update(response_from_db);

    return {
        status: 200,
        body: {
            status: 'OK',
            description: 'Resource updated successfully.'
        }
    };
}
