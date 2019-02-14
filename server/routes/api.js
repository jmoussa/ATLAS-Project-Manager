const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const mongoose = require('mongoose');
const crypto = require('crypto');

//Connect with Mongoose
const db = 'mongodb://localhost:27017/mean';
mongoose.connect(db, err => {
    if(err){
        console.error(err);
    }else{
        console.log('Connected to MongoDB');
    }
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request');
    }
    // get actual token from 'Bearer (token)'
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
        return res.status(401).send('Unauthorized Request');
    }
    let payload;
    try{
        payload = jwt.verify(token, '9BE8E6BD694631521DB9B724C9A7F');
    }catch (e){
        
    }
    if(!payload){
        return res.status(401).send('Unauthorized Request');
    }
    req.userId = payload.subject;
    next()
}

router.get('/verify', (req, res) => {
    if(!req.headers.authorization)  {
        console.log('NO AUTH HEADERS');
        res.status(200).send(false);
        return;
    }else{
        // get actual token from 'Bearer (token)'
        let token = req.headers.authorization.split(' ')[1];
        if(!token || token === 'null') {
            console.log('NO TOKEN');
            res.status(200).send(false);
            return;
        }else{
            let payload;
            try {
                payload = jwt.verify(token, '9BE8E6BD694631521DB9B724C9A7F');
            }catch (err){
                console.log('PAYLOAD ERROR ' + err);
            }
            if(!payload){
                console.log('NO TOKEN');
                res.status(200).send(false);
                return;
            }else{
                console.log('VERIFIED ' + payload.subject);
                //send back user id
                res.status(200).send({'userId':payload.subject});
            }
        }
    }
});

//Get All Users after verifying token
router.get('/users', verifyToken, (req,res) => {
    User.find({email: new RegExp('.*')}, (error, users)=>{
        if(error){
            console.error(error);
        }else{
            res.status(200).send(users);
        }
    });
})

//Get All Projects after verifying token
router.get('/projects', verifyToken, (req,res) => {
    Project.find({openTo:{$in: [req.query.id]}}, (error, projects)=>{
        if(error){
            console.error(error);
        }else{
            console.log('Projects ' + projects);
            res.status(200).send(projects);
        }
    });
})

router.get('/project', verifyToken, (req,res)=>{
    Project.find({_id: req.query.id}, (error, project)=>{
        if(error){
            console.error(error);
        }else{
            console.log('Project ' + project);
            res.status(200).send(project)
        }
    })
});

router.post('/newProject', (req, res) => {
    let projectData = req.body;
    let project = new Project(projectData);
    project.save((err, newProject) => {
        if(err){
            console.log(err.message);
            return res.status(200).send(false)
        }else{
            console.log('NEW PROJECT ' +  newProject);
            return res.status(200).send(true);
        }
    })
})

router.get('/tasks', (req,res)=> {
    Task.find(
        {$and:[
            {projectId: req.query.projectId},
            {openTo:
                {$in: [req.query.userId]}
            }
        ]}, (error, tasks)=>{
        if(error){
            console.error(error);
            console.log('ERROR FETCHING TASKS ' + error);
        }else{
            console.log('Tasks ' + tasks);
            res.status(200).send(tasks);
        }
    });
});

// REQ: JSON OF TASK
// RES: 'SUCCESS'
router.post('/updateTask', (req,res) => {
    let taskData = req.body;
    let task = new Task(taskData);
    let query = {_id: task._id};
    task.findOneAndUpdate(query, task, {upsert: false}, (err, doc)=>{
        if (err) return res.send(500, { error: err });
        return res.send(200, "SUCCESS");
    });
});

// REQ: JSON OF PROJECT
// RES: 'SUCCESS'
router.post('/updateProject', (req,res) => {
    let projectData = req.body;
    let project = new Project(projectData);
    let query = {_id: task._id};
    project.findOneAndUpdate(query, project, {upsert: false}, (err, doc)=>{
        if (err) return res.send(500, { error: err });
        return res.send(200, "SUCCESS");
    });
});

//Register new User
router.post('/register', (req, res) => {
    let userData = req.body;
    //Cast to mongoose 'User' model
    let user = new User(userData);
    // Hash password and store hash and salt
    let password = user.password;
    let pHash = saltHashPassword(password);
    user.password = pHash.passwordHash;
    user.salt = pHash.salt;

    User.findOne({email: userData.email}, (error, userResponse) => {
        if(error){
            console.log(error);
        }else{
            
            if(!userResponse){
                console.log('User doesn\'t exist, proceed');
                user.save((err, registeredUser)=> {
                    if(err){
                        console.error(err);
                    }else{
                        console.log(registeredUser);
                        let payload = { subject: registeredUser._id};
                        let token = jwt.sign(payload, '9BE8E6BD694631521DB9B724C9A7F', {expiresIn: '24h'});
                        return res.status(200).send({token});
                    }
                });
            }else{
                console.log('User EXISTS STOP');
                let message = {
                    message: 'User Exists'
                }
                return res.status(200).send({message});
            }
        }
    });
});

//Login
router.post('/login', (req,res)=>{
    let userData = req.body;
    
    //collection.findOne()

    User.findOne({email: userData.email}, (error, user)=>{
        if(error){
            console.log(error);
        }else{
            if(!user){
                res.status(401).send('Invalid Email');
            }else if(user.password !== sha512(userData.password, user.salt).passwordHash){
                res.status(401).send('Invalid Password');
            }else{
                //modify to send JWT
                let payload = { subject: user._id};
                let token = jwt.sign(payload, '9BE8E6BD694631521DB9B724C9A7F', {expiresIn: '24h'});
                res.status(200).send({token});
            }
        }
    })
});

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}
module.exports = router;