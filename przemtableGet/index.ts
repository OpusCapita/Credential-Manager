import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { get } from "./controllers/fetching/Get";
import { getReceive } from "./controllers/receiving/Get";
import { create } from "./controllers/fetching/Create";
import { update } from "./controllers/fetching/Update";
import { remove } from "./controllers/fetching/Remove";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
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
                    status: 'Method not allowed'
                }
            };
            break;
    }
};

export default httpTrigger;