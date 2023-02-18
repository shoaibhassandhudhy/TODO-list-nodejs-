import {Express, Request, Response} from "express";
import {createUserSchema, createUserSessionSchema} from "../schema/user.schema";
import {createTaskSchema} from "../schema/task.schema";
import {createUserHandler} from "../controller/user.controller";
import {postCreateTask, indexTask} from "../controller/task.controller";
import {auth, requiresUser, validate} from "../middleware";
import {
    createUserSessionHandler,
    getUserSessionsHandler,
    sessionValidation
} from "../controller/session.controller";

/**
 * @param app
 */
export default function (app: Express) {
    //Start public routes
    app.all("/", (req: Request, res: Response) => res.status(200).send({status: "success"}));
    app.post("/register", validate(createUserSchema), createUserHandler);
    //end public routes 
    app.post("/login", validate(createUserSessionSchema), createUserSessionHandler);
    app.use(auth);//validate jwt token and user session  
    

    // Get Authenticated routes
    app.get("/user", getUserSessionsHandler);
    app.delete("/logout", requiresUser, sessionValidation);
    app.post("/create-task", [requiresUser, validate(createTaskSchema)], postCreateTask);
    app.get("/list-tasks", requiresUser, indexTask);
    //end Authenticated routes 
}