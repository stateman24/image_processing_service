import express from "express"
import { mongoose } from "mongoose"
import { router } from "./routes/user.routes.js";
import image_router from "./routes/images.routes.js";
import config from "./config.js"
import fileUpload from "express-fileupload";


const app = express();

const userRouter = router;
const imageRouter = image_router;


//  middeleware
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get("/", (req, res) =>{
    try {
        res.status(200).json({"Greetings":"Hello World"})
    } catch (error) {
        res.status(404).send({ "message": error.message });
    }
})

// routes
app.use("/users", userRouter);
app.use("/image", imageRouter);



mongoose.connect(config.MONGO_DB_URI)
.then(() =>{
    console.log("Connected to the database");
    app.listen(config.PORT, () =>{
        console.log(`Server is running on port ${config.PORT}`);
    });
}).catch((err) =>{
    console.error(`Connection Failed: ${err}`)
})


