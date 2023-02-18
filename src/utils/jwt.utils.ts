import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get("privateKey") as string;
const jwtKey = config.get("jwtKey")

/**
 * @param object
 * @param options
 */
export function sign(object: Object) {
    return jwt.sign(object,config.get("jwtKey"), {
        expiresIn: config.get("jwtTokenDuration")});
    }

/**
 * @param token
 */
export function decode(token: string) {
    try {
        const decoded = jwt.verify(token, config.get('jwtKey'));
        return { active: true, expired: false, decoded };
    } catch (error) {
        return {
            active: false,
            expired: error.message === "jwt expired",
            decoded: null,
        };
    }
}