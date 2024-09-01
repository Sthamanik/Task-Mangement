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
        }
    },
    {
        timpestamps: true
    }
)


export const Tasks = mongoose.model("Tasks", taskSchema)