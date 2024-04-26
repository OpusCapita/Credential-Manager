import { error } from "console";

/**
 * Throws an error if a database resource already exists.
 * @param object - The object to check if it exists.
 * @param file_name - The name of the file associated with the resource.
 * @throws {Object} - An error object with status 409 and a body containing the conflict details.
 */
export const throwIfDatabaseResourceExists = (object: any, file_name: string) => {
    if (object) {
        throw {
            status: 409,
            error: true,
            body: {
                status: 'Conflict',
                file_name: file_name,
                description: `Resource with the provided ${file_name} already exists.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}

/**
 * Throws an error if the database resource does not exist.
 * @param object - The object to check if it exists.
 * @param file_name - The name of the file associated with the resource.
 * @throws {Object} - An error object with status 404 and a description of the error.
 */
export const throwIfDatabaseResourceNotExists = (object: any, file_name: string) => {
    if (!object) {
        throw {
            status: 404,
            error: true,
            body: {
                status: 'Not Found',
                description: `Resource with the provided ${file_name} does not exists.`
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
}
