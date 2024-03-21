import { checkIfTypeIsString, checkRequestBodyParamsForCreateOrUpdate } from "../../../_helpers/RequestParamsHelperPrzemtable";

import CredentialPrzemtable from '../../../_common/models/CredentialPrzemtable.model';
import { HttpRequest } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';

export const create = async (req: HttpRequest) => {
const PartitionKey = uuidv4();

    try {
        // Check if row with uuid already exists
        const response_from_db = await CredentialPrzemtable.get(PartitionKey);

        if (response_from_db) {
            return {
                status: 409,
                body: {
                    status: 'Fail',
                    description: 'Resource with the provided PartitionKey already exists.'
                }
            };
        }

        await CredentialPrzemtable.create(PartitionKey, req.body);
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
            status: 'OK',
            PartitionKey: PartitionKey,
            description: 'New resource created successfully.'
        }
    };
}
