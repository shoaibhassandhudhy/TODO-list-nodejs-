import {LeanDocument, FilterQuery, UpdateQuery} from "mongoose";
import {UserDocument} from "../model/user.model";
import Session, {SessionDocument} from "../model/session.model";
import {decode, sign} from "../utils/jwt.utils";
import {get} from "lodash";
import {findUser} from "./user.service";

/**
 *
 */
export interface userSession {
    user: | Omit<UserDocument, "password"> | LeanDocument<Omit<UserDocument, "password">>;
    session: | Omit<SessionDocument, "password"> | LeanDocument<Omit<SessionDocument, "password">>;
}

/**
 * @param userId
 * 
 */
export async function createSession(userId: string) {
    const filter = { user: userId };
    const update = { active: true };
    const session = await Session.findOneAndUpdate(filter, update, {
        new: true,
        upsert:true
    });
    return session.toJSON();
}

/**
 * @param user
 * @param session
 */
export function createAccessToken({user, session}: userSession) {
    // Build and return the new access token
    return sign({...user, session: session._id}
);
}

/**
 * @param query
 * @param update
 */
export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return Session.updateOne(query, update);
}

/**
 * @param query
 */
export async function findSessions(query: FilterQuery<SessionDocument>) {
    return Session.find(query).sort({_id: -1}).limit(1).lean();
}