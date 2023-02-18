import {JwtPayload,verify} from "jsonwebtoken";
import config from "config";
import {Request, Response, NextFunction} from "express";
import {get} from "lodash";
import {findSessions} from "../service/session.service";
export interface userAuthInfoRequest extends Request {
    user?: object | string | null | JwtPayload
}

const auth = async(request: userAuthInfoRequest, response: Response, next: NextFunction) => {
    try {       
        const token = get(request, "headers.authorization", "").replace(/^Bearer\s/, "");
        const decoded = verify(token, config.get('jwtKey'));
        if (decoded) {
            if (typeof decoded === "object") {
                request.user = decoded;
                const sessionId = get(request, "user.session");
                const session = await findSessions({_id: sessionId})
                if(session.length == 0){
                    return response.status(401).json({
                        message: 'No session availabe'
                    });
                }else if(session[0].active === false){
                    return response.status(401).json({
                        message: 'Your Session is expire please login'
                    });
                }
                
            }
            return next();
        }
        return next();
    } catch (e) {
        return response.status(401).json({
            message: 'JWT Token Expire'
        });
    }
};
export default auth;