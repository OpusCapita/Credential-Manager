import { checkIfTypeIsString, checkRequestBodyParamsForCreateOrUpdate } from "../../../_helpers/RequestParamsHelperPrzemtable";

import { HttpRequest } from "@azure/functions";
import CredentialPrzemtable from "../../../_common/models/CredentialPrzemtable.model";

export const update = async (req: HttpRequest) => {
    const { PartitionKey } = req.query;

    try {
        // Check if row with PartitionKey already exists
        let response_from_db = await CredentialPrzemtable.get(PartitionKey);

        // If not exist create
        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Fail',
                    description: 'Resource with the provided ID Credential does not exist.'
                }
            };
        }
        else {
            // Update object properties
            response_from_db = {
                ...response_from_db,
                ...req.body,
                updated_at: new Date().toISOString()
            }

            await CredentialPrzemtable.update(response_from_db);
        }
    }
    catch (error) {
        if (error.status) {
            return error;
        }

        return {
            status: 500,
            body: {
                status: 'Error',
                description: 'An unexpected error occurred. Please try again later.'
            }
        };
    }

    return {
        status: 201,
        body: {
            status: 'Created',
            PartitionKey: PartitionKey,
            description: 'Resource updated successfully.'
        }
    };
}
