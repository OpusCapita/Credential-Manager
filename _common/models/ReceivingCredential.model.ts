import * as AzureStorage from 'azure-storage';

import { CONNECTION_STRING } from '../parameters/EnvParameters';
import { ErrorLogs } from './ErrorLogs.model';

export default class ReceivingCredential {
    private static table_name = 'receivingCredentials';
    private static connection_string = CONNECTION_STRING;
    private static table_service = AzureStorage.createTableService(this.connection_string);

    /**
     * Creates a new ReceivingCredential entity.
     * 
     * @param id_account - The account ID.
     * @param uuid - The UUID of the credential.
     * @param username - The username associated with the credential.
     * @returns A promise that resolves with the result of the creation.
     */
    static create = async (id_account: number, uuid: string, username: string) => {
        // Create an entity object
        const object = {
            RowKey: id_account,
            PartitionKey: id_account,
            uuid: uuid,
            id_account: id_account,
            username: username,
            created_at: new Date().toISOString()
        };

        // Create object
        await new Promise((resolve, reject) => {
            this.table_service.insertEntity(this.table_name, object, function (error, result, response) {
                if (error) {
                    ErrorLogs.insert(object, `Problem when trying to create new object: ${error}`, '--- Create ---');

                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Get object
     * @param {string} id_account - Account ID
     * @return {object} - Return object from DB
     **/
    static get = async (id_account: number) => {
        // Define the query
        const query = new AzureStorage.TableQuery().where('id_account eq ?', id_account);

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

    /**
     * Update object
     * @param {object} entity - Object from DB
     * @return {void} - Return void
     **/
    static update = async (entity: any) => await new Promise((resolve, reject) => {
        this.table_service.replaceEntity(this.table_name, entity, (error, result) => {
            if (error) {
                ErrorLogs.insert({}, `Problem when trying to update object: ${error}`, '--- Update ---');

                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });

    /**
     * Delete object from DB
     * @param {object} entity - DB entity
     * @param {string} row_key - Row Key
     * @return {void} - Return void
     **/
    static delete = async (entity: object) => await new Promise((resolve, reject) => {
        this.table_service.deleteEntity(this.table_name, entity, (error, response) => {
            if (error) {
                ErrorLogs.insert({}, `Problem when trying to remove object: ${error}`, '--- Remove ---');

                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}
