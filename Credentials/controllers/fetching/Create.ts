import { checkIfRequestBodyExists, checkIfTypeIsString } from "../../../_common/utils/Request.utils";

import Credential from '../../../_common/models/Credential.model';
import { HttpRequest } from "@azure/functions";
import { Password } from '../../models/Password';
import { checkFetchingRequestBodyParamsForCreateOrUpdate } from "../../../_common/utils/FetchingRequest.utils";
import { throwIfDatabaseResourceExists } from "../../../_common/utils/DatabaseResponse.utils";

export const create = async (req: HttpRequest) => {
    // Check if request body exists
    checkIfRequestBodyExists(req.body);

    const { id_connection, password } = req.body;

    // Chack body params
    checkFetchingRequestBodyParamsForCreateOrUpdate(id_connection, password);

    // Check connection
    checkIfTypeIsString(id_connection, 'id_connection');

    // Check password
    checkIfTypeIsString(password, 'password');

    // Check if row with id_connection already exists
    const response_from_db = await Credential.get(id_connection);

    // If exists throw error 409 - Conflict
    throwIfDatabaseResourceExists(response_from_db, 'id_connection');

    const encrypt_password = Password.encryptPassword(password);

    await Credential.create(encrypt_password, id_connection);

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
