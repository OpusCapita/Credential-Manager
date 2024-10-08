import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { ErrorLogs } from "../_common/models/ErrorLogs.model";
import { create } from "./controllers/fetching/Create";
import { createReceive } from "./controllers/receiving/Create";
import { get } from "./controllers/fetching/Get";
import { getAllReceive } from "./controllers/receiving/GetAll";
import { getReceive } from "./controllers/receiving/Get";
import { remove } from "./controllers/fetching/Remove";
import { removeReceive } from "./controllers/receiving/Remove";
import { update } from "./controllers/fetching/Update";
import { updateReceive } from "./controllers/receiving/Update";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { receive, get_list } = req.query;

    try {
        // Check if request is for receiving
        if (receive) {
            switch (req.method) {
                case 'POST':
                    context.res = await createReceive(req);

                    break;
                case 'GET':
                    context.res = get_list ? await getAllReceive(req) : await getReceive(req);

                    break;
                case 'PUT':
                    context.res = await updateReceive(req);

                    break;

                case 'DELETE':
                    context.res = await removeReceive(req);

                    break;
                default:
                    context.res = {
                        status: 405,
                        body: {
                            status: 'Method not allowed.'
                        }
                    };

                    break;
            }

            return;
        }

        // Check if request is for fetching
        switch (req.method) {
            case 'POST':
                context.res = await create(req);

                break;
            case 'GET':
                context.res = await get(req);

                break;
            case 'PUT':
                context.res = await update(req);

                break;

            case 'DELETE':
                context.res = await remove(req);
                break;
            default:
                context.res = {
                    status: 405,
                    body: {
                        status: 'Method not allowed.'
                    }
                };

                break;
        }
    } catch (error) {
        context.res = {
            status: error.status || 500,
            body: error.body || {
                status: 'Internal error'
            },
            headers: error.headers || {
                'Content-Type': 'application/json'
            }
        };

        ErrorLogs.insert(
            { error: error, req: req },
            'Unexpected error occurred.',
            '--- Internal error ---'
        );
    }
};

export default httpTrigger;
