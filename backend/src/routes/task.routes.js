import {Router } from "express";
import { deleteAllCompletedTasks, deleteTask, getCompletedTasks, getIncompletedTasks, setCompleted, setTasks, updateTask } from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/setTasks').post(verifyJWT, setTasks)
router.route('/getIncompletedTasks').get(verifyJWT, getIncompletedTasks)
router.route('/setCompleted').put(verifyJWT, setCompleted)
router.route('/getCompletedTasks').get(verifyJWT, getCompletedTasks)
router.route('/updateTask').put(verifyJWT, updateTask)
router.route('/deleteTask').delete(verifyJWT, deleteTask)
router.route('/deleteAll').delete(verifyJWT, deleteAllCompletedTasks)

export default router