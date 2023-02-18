import {Request, Response} from "express";
import { getUserDetails, validatePassword} from "../service/user.service";
import {createAccessToken, createSession, updateSession, userSession} from "../service/session.service";
import {get} from "lodash";

/**
 * POST /login
 * @param request
 * @param response
 */
export async function createUserSessionHandler(request: Request, response: Response) {
    //validate user credentials
    const user = await validatePassword(request.body);
    if (!user) return response.status(401).send({status: "error", message: "Invalid credentials"});

    //create session for user in database 
    const session = await createSession(user._id);
    const accessToken = createAccessToken(<userSession>{user, session});

    return response.send({accessToken});
}

/**
 * DELETE /logout
 * @param request
 * @param response
 */
export async function sessionValidation(request: Request, response: Response) {
    const sessionId = get(request, "user.session");
    await updateSession({_id: sessionId}, {active: false});
    return response.status(200).send({status: "success"});
}

/**
 * / GET /user
 * @param request
 * @param response
 */
export async function getUserSessionsHandler(request: Request, response: Response) {
    const userId = get(request, "user._id");
    const user = await getUserDetails({_id: userId});
    return response.send(user);
}