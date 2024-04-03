import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { create } from "./controllers/fetching/Create";
import { get } from "./controllers/fetching/Get";
import { getReceive } from "./controllers/receiving/Get";
import { remove } from "./controllers/fetching/Remove";
import { update } from "./controllers/fetching/Update";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        const { receive } = req.query;

        if (receive) {
            context.res = await getReceive(req);
            return;
        }

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
            status: error.status ?? 500,
            body: error.body ?? {
                status: 'Internal error',
                description: 'An unexpected error occurred. Please try again later.'
            }
        };
    }
};

export default httpTrigger;


