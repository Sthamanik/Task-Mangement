import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes.js'
import tasksRouter from './routes/task.routes.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// routes of the api
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", tasksRouter)

export {app}