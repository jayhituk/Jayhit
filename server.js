const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

const TodoSchema = new mongoose.Schema({
    username: String,
    task: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const Todo = mongoose.model("Todo", TodoSchema);

const User = mongoose.model("User", UserSchema);

app.post("/register", async(req,res)=>{
    try{
        const {username,password}=req.body;

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            username,
            password:hashedPassword
        });

        await newUser.save();

        res.json({message:"User Registered"});
    }
    catch(err){
        console.log(err);
        res.json({message:err.message});
    }
});

app.post("/login", async(req,res)=>{
    const {username,password}=req.body;

    const user = await User.findOne({username});

    if(!user){
        return res.json({message:"User not found"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(isMatch){
        res.json({message:"Login Success"});
    }else{
        res.json({message:"Wrong Password"});
    }
});

app.post("/add-task", async (req, res) => {
    const { username, task } = req.body;

    const newTask = new Todo({
        username,
        task
    });

    await newTask.save();

    res.json({ message: "Task Added" });
});
app.post("/get-tasks", async (req, res) => {
    const { username } = req.body;

    const tasks = await Todo.find({ username });

    res.json(tasks);
});
app.post("/delete-task", async (req, res) => {
    const { id } = req.body;

    await Todo.findByIdAndDelete(id);

    res.json({ message: "Task Deleted" });
});
app.listen(process.env.PORT, ()=>{
    console.log(`Server running ${process.env.PORT}`);
});