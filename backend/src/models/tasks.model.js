import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema (
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        scheduledAt: {
            type: String,
            required: true
        }
    },
    {
        timpestamps: true
    }
)


export const Tasks = mongoose.model("Tasks", taskSchema)