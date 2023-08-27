import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv'
dotenv.config();

// this goes into environment variables
const secretKey = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered Successfully." });

    } catch (err) {
        console.error('Error while registering user:', err);
        res.status(500).json({ message: `Username or email is taken.` });
    }
}
const loginUser = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ userId: user.id }, secretKey);
        
        res.status(200).json({ token });
    } catch(err){
        console.error('Error while logging in user: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// const requireAuthorization = async (req, res, next) => {
//     const token = req.headers.authorization;
//     console.log("token checker: ", token)

//     if(!token){
//         return res.status(401).json({ message: 'Authorization token is missing.' });
//     }
//     jwt.verify(token, secretKey, (err, decoded) => {
//         if(err){
//             return res.status(403).json({ message: 'Authorization failed.' });
//         }
//         req.userId = decoded.userId // store user ID for later use
//         next();
//     });
// };

const generatePhotos = async (inputValue) => {
    const openaiUrl = "https://api.openai.com/v1/images/generations";
    const apiKey = process.env.Openai_Access_Key;
    const bearer = 'Bearer ' + apiKey;
    try {
        const response = await fetch(openaiUrl, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "prompt": `${inputValue}`,
                "n": 6,
                "size": "256x256",
            })
        });


        if (!response.ok) {
            throw new Error(`Network response was not ok from server: ${response.status}`);
        }

        const data = await response.json();
        console.log("DATA: ", data)
        const myImages = data.data;

        return myImages;
    } catch (error) {
        console.error('Something bad happened:', error);
        throw error; // Re-throw the error to be handled at the higher level
    }
};

const getPhotos = async (inputValue, page) => {
    const accessKey =  process.env.Unsplash_Access_Key
    try{
        console.log("touch test in try block in getPhotos")
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${inputValue}&client_id=${accessKey}`)
        const data = await response.json();
        const results = data.results;
        console.log("results from unsplash: ", results)
        return results;
    } catch (error){
        console.error('Something bad happened:', error);
        throw error; // Re-throw the error to be handled at the higher level
    }
};



export default {
    generatePhotos,
    getPhotos,
    registerUser,
    loginUser,
    // requireAuthorization
};