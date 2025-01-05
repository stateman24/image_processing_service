import express from "express"
import { mongoose } from "mongoose"
import { router } from "./routes/user.routes.js";
import config from "./config.js"



const userRouter = router;

const app = express();

// routes
app.use("/", userRouter);



mongoose.connect(config.MONGO_DB_URI)
.then(() =>{
    console.log("Connected to the database");
    app.listen(config.PORT, () =>{
        console.log(`Server is running on port ${config.PORT}`);
    });
}).catch((err) =>{
    console.error(`Connection Failed: {err}`)
})


