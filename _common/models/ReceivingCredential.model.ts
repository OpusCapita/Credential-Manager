import * as AzureStorage from 'azure-storage';

import { CONNECTION_STRING } from '../parameters/EnvParameters';
import { ErrorLogs } from './ErrorLogs.model';
import { v4 as uuidv4 } from 'uuid';

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
        const rowKey = uuidv4();

        // Create an entity object
        const object = {
            RowKey: rowKey,
            PartitionKey: rowKey,
            uuid: uuid,
            username: username,
            id_account: id_account,
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
     * Get object by UUID or username.
     * @param {string} uuid - The UUID of the credential.
     * @param {string} username - The username associated with the credential.
     * @returns {object} - Return object from DB
     **/
    static getByUUIDOrUsername = async (uuid: string, username: string) => {
        // Define the query
        const query = new AzureStorage.TableQuery().where('uuid eq ? or username eq ?', uuid, username);
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
        return results.entries.map(entry => ({
            uuid: entry.uuid._,
            username: entry.username._,
            id_account: entry.id_account._,
        }));
    }

    /**
     * Get object
     * @param {string} uuid - Azure Tenant ID
     * @return {object} - Return object from DB
     **/
    static getUUID = async (uuid: string) => {
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

    /**
     * Get object
     * @param {string} username - Client username
     * @return {object} - Return object from DB
     **/
    static getUsername = async (username: string) => {
        // Define the query
        const query = new AzureStorage.TableQuery().where('username eq ?', username);

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
     * Retrieves all receiving credentials from the database.
     * @returns {Promise<Array<{ uuid: string, id_account: string, username: string }>>} A promise that resolves to an array of receiving credentials.
     */
    static getAll = async () => {
        // Get objects from DB
        const results: any = await new Promise((resolve, reject) => {
            const query = new AzureStorage.TableQuery().select('uuid', 'username', 'id_account');
            this.table_service.queryEntities(this.table_name, query, null, (error, result) => {
                if (error) {
                    ErrorLogs.insert({}, `Problem when trying to get all objects: ${error}`, '--- Get All Receiving Credentials ---');

                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });

        // Transform the results to the desired format
        return results.entries.map(entry => ({
            uuid: entry.uuid._,
            id_account: entry.id_account._,
            username: entry.username._
        }));
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
