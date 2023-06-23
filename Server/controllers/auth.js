import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: 0,
            impressions: 0,
            }
        );
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json( { error: err.message} );
    }
}

// Logging in
export const login = async (req, res) => {
    try {
        // Get data from request body
        const {email, password} = req.body;
        // Try to find the user
        const user = await User.findOne({email: email});
        // If we have no user, respond with error
        if(!user) return res.status(400).json({msg: "User does not exist."});
        // Setup a check for the hashed password that is saved and the one thats currently given by the user
        const isMatch = await bcrypt.compare(password, user.password);
        // If they do not match, repond with error
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials. "});
        // Create a token containing the user-id (generated and given by the database) and a secret string, saved in the .env file
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        // For security: Delete the password from the user-oject
        delete user.password;
        // respond with status 200 (OK) and attach the new token and the user object
        res.status(200).json({token, user});

    } catch (err) {
        res.status(500).json( { error: err.message} );
    }
}