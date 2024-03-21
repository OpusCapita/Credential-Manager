import { checkIfTypeIsString, checkRequestQueryParamsForGetOrRemove } from "../../../_helpers/RequestParamsHelperPrzemtable";

import { HttpRequest } from "@azure/functions";
import CredentialPrzemtable from "../../../_common/models/CredentialPrzemtable.model";

export const remove = async (req: HttpRequest) => {
    const { PartitionKey } = req.query;

    try {
        // Chack body params
        checkRequestQueryParamsForGetOrRemove(PartitionKey);

        // Check connection
        checkIfTypeIsString(PartitionKey, 'PartitionKey');

        // Check if row with PartitionKey already exists
        let response_from_db = await CredentialPrzemtable.get(PartitionKey);

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Fail',
                    description: 'Resource with the provided uuid does not exist.'
                }
            };
        }

        await CredentialPrzemtable.delete(response_from_db);
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
        status: 200,
        body: {
            status: 'OK',
            PartitionKey: PartitionKey,
            description: 'Resource deleted successfully.'
        }
    };
}
