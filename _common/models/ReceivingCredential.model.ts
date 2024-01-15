import * as AzureStorage from 'azure-storage';

import { CONNECTION_STRING } from '../parameters/EnvParameters';
import { ErrorLogs } from './ErrorLogs.model';

export default class ReceivingCredential {
    private static table_name = 'receivingCredentials';
    private static connection_string = CONNECTION_STRING;
    private static table_service = AzureStorage.createTableService(this.connection_string);

    /**
     * Get object
     * @param {string} uuid - Client uuid
     * @return {object} - Return object from DB
     **/
    static get = async (uuid: string) => {
        // Define the query
        const query = new AzureStorage.TableQuery().where('uuid eq ?', uuid);

        // Get objects from DB
        const results: any = await new Promise((resolve, reject) => {
            this.table_service.queryEntities(this.table_name, query, null, (error, result) => {
                if (error) {
                    ErrorLogs.insert({}, `Problem when trying to get object: ${error}`, '--- Get Receiving Credentials ---');

                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });

        return results.entries[0];
    }
}
