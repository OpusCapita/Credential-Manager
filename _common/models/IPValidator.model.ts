import { HttpRequest } from "@azure/functions";
import { NAGIOS_IP } from "../parameters/EnvParameters";

/**
 * IPValidator is a utility class that provides methods for validating client IP addresses
 * against a predefined list of allowed IPs.
 */
export class IPValidator {
    /**
     * A static readonly array containing the allowed IP addresses.
     * Any client IP attempting to access the system should be present in this list
     * to be considered valid.
     */
    private static readonly allowedIPs = [NAGIOS_IP];

    /**
     * isValidClientIP method checks whether the client IP extracted from the provided
     * HttpRequest is included in the list of allowed IPs.
     * @param request - The HttpRequest object representing the incoming client request.
     * @returns A boolean indicating whether the client IP is valid or not.
     */
    public static isValidClientIP(request: HttpRequest): boolean {
        const headers = request.headers;
        const ipAddressWithPort = headers['x-forwarded-for'] || '';
        const [clientIp] = ipAddressWithPort.split(':');

        // Check if the client IP is in the allowed list
        return IPValidator.allowedIPs.includes(clientIp);
    }
}
