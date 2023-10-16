import { API_ID_URL } from "../parameters/EnvParameters";

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

/**
 * Validates and decodes a JWT token.
 *
 * @param {string} bearer_token - The bearer token from the authorization header.
 * @returns {Promise<Object>} An object containing decoded JWT claims.
 * @throws {Object} Throws an error if validation fails.
 */
export const checkJWT = async (bearerToken) => {
    if (!bearerToken) {
        throw createError(401, 'Authorization header missing');
    }

    const token = getTokenFromBearer(bearerToken);

    try {
        const { kid, tenantId, roles, aud, gwAccount } = decodeToken(token);

        validateRequiredFields(kid, tenantId, roles, aud);
        validateRole(roles);
        validateAppIdUrl(aud);

        const signingKey = await getSigningKey(tenantId, kid);

        await verifyToken(token, signingKey);

        return { kid, tenantId, roles, aud, gwAccount };
    }
    catch (error) {
        throw createError(error.status || 500, `Error - ${error.message}`);
    }
};

/**
 * Creates an error object with status and description properties.
 *
 * @param {number} status - The HTTP status code for the error.
 * @param {string} description - A description of the error.
 * @returns {Object} An error object.
 */
const createError = (status, description) => {
    return {
        status,
        body: {
            status: 'Error',
            description
        }
    };
}

/**
 * Extracts the JWT token from the bearer token in the authorization header.
 *
 * @param {string} bearer_token - The bearer token from the authorization header.
 * @returns {string} The extracted JWT token.
 * @throws {Object} Throws an error if the JWT token is missing.
 */
const getTokenFromBearer = (bearerToken) => {
    const token = bearerToken.split(' ')[1];

    if (!token) {
        throw createError(401, 'Incorrect JWT');
    }

    return token;
}

/**
 * Decodes the JWT token to retrieve its header and payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {Object} Decoded JWT claims.
 * @throws {Object} Throws an error if decoding fails.
 */
const decodeToken = (token) => {
    const decoded = jwt.decode(token, { complete: true });
    const { tid: tenantId, roles, aud, appid: gwAccount } = decoded.payload;
    const { kid } = decoded.header;

    return { kid, tenantId, roles, aud, gwAccount };
}

/**
 * Validates the presence of required fields in the JWT claims.
 *
 * @param {string} kid - Key identifier from the token header.
 * @param {string} tenantId - Tenant ID from the token payload.
 * @param {Array} roles - Array of roles from the token payload.
 * @param {string} aud - Audience from the token payload.
 * @throws {Object} Throws an error if any required field is missing.
 */
const validateRequiredFields = (kid, tenantId, roles, aud) => {
    if (!kid || !tenantId || !roles || !aud) {
        throw createError(401, 'Incorrect JWT');
    }
}

/**
 * Validates the presence of a specific role in the JWT claims.
 *
 * @param {Array} roles - Array of roles from the token payload.
 * @throws {Object} Throws an error if the required role is missing.
 */
const validateRole = (roles) => {
    if (!roles.includes('GetMonitorInformations')) {
        throw createError(403, 'Forbidden: Insufficient privileges');
    }
}

/**
 * Validates the Application ID URL in the JWT claims.
 *
 * @param {string} aud - Audience from the token payload.
 * @throws {Object} Throws an error if the Application ID URL is incorrect.
 */
const validateAppIdUrl = (aud) => {
    if (aud !== API_ID_URL) {
        throw createError(403, 'Forbidden: Incorrect Application ID URL');
    }
}

/**
 * Retrieves the signing key from the JWKS endpoint for JWT verification.
 *
 * @param {string} tenantId - Tenant ID from the token payload.
 * @param {string} kid - Key identifier from the token header.
 * @returns {Promise<string>} The public key for JWT verification.
 * @throws {Object} Throws an error if key retrieval fails.
 */
const getSigningKey = async (tenantId, kid) => {
    const client = jwksClient({
        jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
        cache: true,
        rateLimit: true,
    });

    const key = await client.getSigningKey(kid);

    return key.publicKey || key.rsaPublicKey;
}

/**
 * Verifies the JWT token's signature using the provided public key.
 *
 * @param {string} token - The JWT token to verify.
 * @param {string} signingKey - The public key for JWT verification.
 * @throws {Object} Throws an error if JWT verification fails.
 */
const verifyToken = async (token, signingKey) => await jwt.verify(token, signingKey, { algorithms: ['RS256'] });
