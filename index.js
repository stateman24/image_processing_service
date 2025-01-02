import express from "express"
import { mongoose } from "mongoose"
import { router } from "./routes/user.routes.js";

const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

const userRouter = router;

const app = express();

// routes
app.use("/user", userRouter);



mongoose.connect(`mongodb+srv://ajibewadannyboi:${DB_PASSWORD}@danielcluster.fd5sg.mongodb.net/ip_servicedb?retryWrites=true&w=majority&appName=danielcluster`)
.then(() =>{
    console.log("Connected to the database");
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) =>{
    console.error(`Connection Failed: {err}`)
})


