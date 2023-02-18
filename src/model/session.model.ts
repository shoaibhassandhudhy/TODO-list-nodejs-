import mongoose from "mongoose";
import {UserDocument} from "./user.model";

/**
 * SessionDocument Interface
 */
export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * SessionSchema
 */
const SessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        active: { type: Boolean, default: true }
    },
    {timestamps: true}
);
const Session = mongoose.model<SessionDocument>("Session", SessionSchema);
export default Session;