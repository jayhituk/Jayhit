const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

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

app.listen(process.env.PORT, ()=>{
    console.log(`Server running ${process.env.PORT}`);
});