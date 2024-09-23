import { asyncHandler } from "../utils/asyncHandlers.js";
import { Tasks } from "../models/tasks.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const setTasks = asyncHandler ( async (req, res) => {
    const {title, description, isCompleted, scheduledAt, type} = req.body
    if ( !title || !description || !scheduledAt || !type){
        throw new ApiError (400, "All fields are required")
    }

    if ( type !== 'primary' && type != 'personal' && type !== 'others' )
        throw new ApiError (400, "Invalid task type. Please select primary, personal or others.")

    const scheduledDate = new Date(scheduledAt)
    const currentDate = new Date()

    if ( currentDate >= scheduledDate) throw new ApiError (400, "The scheduled time must be later than the current time.")

    const date = scheduledAt.split('T')[0];

    const existingTask = await Tasks.findOne(
        {
            title, 
            scheduledAt: {$regex: new RegExp(`^${date}T.*`)},
            createdBy: req.user._id
        }
    )

    if (existingTask) throw new ApiError(400, "A task with this title is already scheduled for this day")
    
    const tasks = await Tasks.create({
        title,
        description,
        createdBy: req.user._id,
        isCompleted,
        scheduledAt,
        type
    })

    return res.status(201).json(
        new ApiResponse ( 201, tasks, "Tasks Scheduled Successfully")
    )

})

const getIncompletedTasks = asyncHandler ( async ( req, res) => {  
    const tasks = await Tasks.find({createdBy: req.user._id, isCompleted: false})
    if (!tasks || tasks.length === 0)
        return res.status(204).json(new ApiResponse(204, {}, "No tasks present"))

    return res.status(200).json(new ApiResponse(200, tasks, "tasks fetched successfully")) 
})

const setCompleted = asyncHandler (async (req, res)=> {
    if (!req.query.id) throw new ApiError(400, "Task ID is required")
    if ((req.query.id).length !== 24) throw new ApiError(400, "Invalid Task ID")

    const tasks = await Tasks.findByIdAndUpdate(
        req.query.id, 
        {$set: {isCompleted: true}},
        {new: true}
    )
    if (!tasks) throw new ApiError(404, "Task not found")
        
    return res.status(200).json(new ApiResponse(200, tasks, "Task marked as completed successfully"))

})

const getCompletedTasks = asyncHandler (async (req, res) => {
    const tasks = await Tasks.find({createdBy: req.user._id, isCompleted: true})
    if (!tasks || tasks.length === 0)
        return res.status(204).json(new ApiResponse(204, {}, "No completed tasks present"))
    
    return res.status(200).json(new ApiResponse(200, tasks, "completed tasks fetched successfully"))
})

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, scheduledAt,isCompleted, type} = req.body;
    let completedStatus = isCompleted
    const { id } = req.query;

    if (!id || id.length !== 24) throw new ApiError(400, "Valid Task ID is required");
    if (!title || !description || !scheduledAt || !type) throw new ApiError(400, "All fields are required");
    if ( type!== 'primary' && type!= 'personal' && type!== 'others' )
        throw new ApiError(400, "Invalid task type. Please select primary, personal or others.");

    const scheduledDate = new Date(scheduledAt);
    if (new Date() <= scheduledDate && completedStatus) {
        completedStatus = false;
     }

    const updatedTask = await Tasks.findOneAndUpdate(
        {
            _id: id,
            createdBy: req.user._id,
        },
        {
            $set: { title, description, isCompleted: completedStatus, scheduledAt, type }
        },
        { new: true }
    );

    if (!updatedTask) throw new ApiError(404, "Task not found or a task with this title is already scheduled for this day");

    return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id || id.length !== 24) throw new ApiError(400, "Valid Task ID is required");

    const deletedTask = await Tasks.findByIdAndDelete(id);
    if (!deletedTask) throw new ApiError(404, "Task not found");

    return res.status(200).json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

const deleteAllCompletedTasks = asyncHandler ( async (req, res) => {
    const deletedTasks = await Tasks.deleteMany({createdBy: req.user._id, isCompleted: true})
    if (deletedTasks.deletedCount === 0) throw new ApiError(404, "No completed tasks found")

    return res.status(200).json(new ApiResponse(200, deletedTasks, "All completed tasks deleted successfully"))
})

export {
    setTasks,
    getIncompletedTasks,
    setCompleted,
    getCompletedTasks,
    updateTask,
    deleteTask,
    deleteAllCompletedTasks
}