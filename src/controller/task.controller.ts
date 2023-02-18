import {Request, Response} from "express";
import {get} from "lodash";
import {createTask, findTasks} from "../service/task.service";

/**
 * POST /create-task
 * @param request
 * @param response
 */
export async function postCreateTask(request: Request, response: Response) {

    const userId = get(request, "user._id");
    const body = request.body;
    const post = await createTask({...body, user: userId});

    return response.send(post);
}

/**
 * GET /list-tasks
 * @param request
 * @param response
 */
export async function indexTask(request: Request, response: Response) {
    const userId = get(request, "user._id");
    const tasks = await findTasks({user_id: userId});
    if (tasks.length === 0) return response.send({status: 'no task found!'});

    return response.send({'count': tasks.length, 'tasks': tasks});
}