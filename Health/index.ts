import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { ErrorLogs } from "../_common/models/ErrorLogs.model";
import { IPValidator } from "../_common/models/IPValidator.model";
import { checkJWT } from "../_common/utils/CheckJWT.utils";
import { VERSION } from "../_common/parameters/Parameters";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {
    let response: any = { // TODO: Add the correct response type
        status: 200,
        body: {
            status: 'OK',
            version: VERSION
        }
    };

    try {
        const isValidIp = await IPValidator.isValidClientIP(req);

        // Check if the client IP is in the allowed list
        if (!isValidIp) {
            const headers = req.headers;

            const authorization = headers['authorization'] || '';

            // Validate the JWT token
            await checkJWT(authorization);
        }
    }
    catch (error) {
        console.log('---- error', error);

        response = handleHealthError(error);
    }

    context.res = response;
}

const handleHealthError = (error: any) => {
    ErrorLogs.insert(error, 'Unknown error', '-- Health Unknown error --');

    return {
        status: error.status ?? 500,
        body: {
            status: 'ERROR',
            description: error.body.description ?? 'Sorry, but the service is temporarily unavailable. Please try again later.'
        }
    };
}

export default httpTrigger;
