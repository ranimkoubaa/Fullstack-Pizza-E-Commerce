/*const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//get
router.get('/',async (req, res,) => {
    try {
        const users = await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Register
router.post('/', async (req, res,) => {
    const { name, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({
        name: name,
        email: email,
        password: hash,
        role: role
    });
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

});
//Login
router.post('/login', async (req, res,) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user == "") {
            res.status(401).send('User not found!');
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ msg: 'Password incorrect!' });
            return;
        }
        const accessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken,
            user
        })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

const generateAccessToken = (user) => {
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:
            '1y'
    });
}

module.exports = router; */

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require( "../middleware/auth.js");
//Register
router.post('/register', async (req, res, )=> {
const{name,email,password,role,avatar}=req.body;
const user = await User.findOne({ email })
if (user) return res.status(404).send({ success: false, message: "Account already exists" })

const salt=await bcrypt.genSalt(10);
const hash=await bcrypt.hash(password,salt);
const newUser=new User({
name:name,
email:email,
password:hash,
role:role,
avatar:avatar
});
try {
await newUser.save();
return res.status(201).send({ success: true, message: "Account created successfully", user: newUser })
} catch (error) {
    res.status(409).json({ message: error.message });
}
});
//Generate Token
const generateToken=(user) =>{
    return jwt.sign({user}, process.env.TOKEN, { expiresIn: '60s' });
    }
    //login
    router.post('/login', async (req, res) => {
    try {
    let { email, password } = req.body
    if (!email || !password) {
    return res.status(404).send({ success: false, message: "All fields are required" })
    }
    let user = await User.findOne({ email })
    if (!user) {
    return res.status(404).send({ success: false, message: "Account doesn't exists" })
    } else {
    let isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {res.status(400).json({success: false, message:'Please verify your credentials'}); return;}
    
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
    success: true,
    token,
    refreshToken,
    user
    })
    }
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    // Refresh
function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.REFRESH_TOKEN, { expiresIn: '60s' });
    }
    //Refresh Route
    router.post('/refreshToken', async (req, res, )=> {
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
    return res.status(404).json({ success: false,message: 'Token Not Found'
    });
    }
    else {
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
    return res.status(406).json({success: false, message:
    'Unauthorized Access' });
    }
    else {
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
    token,
    refreshToken
    })
    }
    });
    }
    
    });
    // Refresh
function generateRefreshToken(user) {
    return jwt.sign({user}, process.env.REFRESH_TOKEN, { expiresIn: '1y' });
    }
    //Refresh Route
    router.post('/refreshToken', async (req, res, )=> {
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
    return res.status(404).json({ success: false,message: 'Token Not Found'
    });
    }
    else {
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
    return res.status(406).json({success: false, message:
    'Unauthorized Access' });
    }
    else {
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
    token,
    refreshToken
    })
    }
    });
    }
    
    });

        // afficher la liste des users.
        router.get('/', async (req, res) => { // Apply auth middleware here
            try {
                const users = await User.find({}, null, { sort: { '_id': -1 }});
                res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

module.exports = router;
