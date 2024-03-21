import { checkIfTypeIsString, checkRequestQueryParamsForGetOrRemove } from "../../../_helpers/RequestParamsHelperPrzemtable";

import { HttpRequest } from "@azure/functions";
import CredentialPrzemtable from "../../../_common/models/CredentialPrzemtable.model";

export const get = async (req: HttpRequest) => {
    const { PartitionKey } = req.query;

    try {
        // Chack body params
        checkRequestQueryParamsForGetOrRemove(PartitionKey);

        // Check connection
        checkIfTypeIsString(PartitionKey, 'PartitionKey');

                
        // Check if row with uuid already exists
        const response_from_db = await CredentialPrzemtable.get(PartitionKey);

        if (!response_from_db) {
            return {
                status: 404,
                body: {
                    status: 'Not found',
                    PartitionKey: PartitionKey,
                    description: 'Resource with the provided PartitionKey not exists.'
                }
            };
        }

        return {
            status: 200,
            body: {
                status: 'OK',
                PartitionKey: PartitionKey,
                payload: response_from_db
            }
        };
    }
    catch (error) {
        if (error.status) {
            return error;
        }

        return {
            status: 500,
            body: {
                status: 'Internal error',
                description: 'An unexpected error occurred. Please try again later.'
            }
        };
    }
}
