import { User } from "../models/user.model.js";


export const register = async(req, res) =>{
    try {
        const {name, email, password} = req.body
        console.log(req.body);
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
}

export const helloWorld = (req, res) =>{
    try {
        res.status(200).json({"Greetings":"Hello World"})
    } catch (error) {
        res.status(404).send({ "message": error.message });
    }
}