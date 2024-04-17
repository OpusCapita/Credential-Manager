import { HttpRequest } from "@azure/functions";
import ReceivingCredential from '../../../_common/models/ReceivingCredential.model';

export const getAllReceive = async (req: HttpRequest) => {
    try {
        const response_from_db = await ReceivingCredential.getAll();

        return {
            status: 200,
            body: {
                status: 'OK',
                payload: response_from_db
            },
            headers: {
                'Content-Type': 'application/json'
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
