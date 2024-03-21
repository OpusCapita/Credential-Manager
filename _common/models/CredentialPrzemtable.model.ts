import * as AzureStorage from 'azure-storage';
import { ErrorLogs } from './ErrorLogs.model';
import { v4 as uuidv4 } from 'uuid';
import { CONNECTION_STRING, TABLE_NAME } from '../parameters/EnvParameters';

export default class CredentialPrzemtable {
    private static table_name = 'Przemtable';
    private static connection_string = CONNECTION_STRING;
    private static table_service = AzureStorage.createTableService(this.connection_string);

    /**
     * Create new object
     * @param {string} PartitionKey - Client PartitionKey
     * @param {json} data - data
     * @return {void} - Return void
     **/
    static create = async (PartitionKey: string, data: any) => {
        
        // Create an entity object
        const object = {
            RowKey: PartitionKey,
            PartitionKey: PartitionKey,
            myVar: data.myVar,
        };

        // Create object
        await new Promise((resolve, reject) => {
            this.table_service.insertEntity(this.table_name, object, function (error, result, response) {
                if (error) {
                    ErrorLogs.insert({}, `Problem when trying to create new object: ${error}`, '--- Create ---');

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
     * @param {string} PartitionKey - Client PartitionKey
     * @return {object} - Return object from DB
     **/
    static get = async (PartitionKey: string) => {
        // Define the query
        const query = new AzureStorage.TableQuery().where('PartitionKey eq ?', PartitionKey);

        // Get objects from DB
        const results: any = await new Promise((resolve, reject) => {
            this.table_service.queryEntities(this.table_name, query, null, (error, result) => {
                if (error) {
                    ErrorLogs.insert({}, `Problem when trying to get object: ${error}`, '--- Get ---');

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
    // TODO: Add interfaces
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
