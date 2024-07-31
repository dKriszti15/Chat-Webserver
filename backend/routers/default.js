import express from 'express'
import path from 'path'
import bcrypt from 'bcrypt';
import Users from '../db/users.db.js'

const def = express.Router();

//const staticDir = path.join(process.cwd(), 'frontend/views');

//def.use(express.static(staticDir));

def.get('/', (req, res) => {
    res.status(200).render('index.ejs', { message: '', loggedUser: ''});
})

def.get('/login', (req,res) => {
    res.status(200).render('login.ejs', { message: '', loggedUser: ''});
})

def.post('/login', express.json(), async (req, res) => {
    console.log(req.body);
    const correctPw = await Users.getUserPassword(req.body.username);
    if(correctPw === null){
        res.status(404).render('login.ejs', {message: `The user '${req.body.username}' does not exist!`, loggedUser: ''})
    }else{
        const iscorrect = await bcrypt.compare(req.body.password, correctPw);
        if (iscorrect){
            req.session.username = req.body.username;
            const role = await Users.getUserRole(req.body.username);
            req.session.role = role;
            res.status(200).render('profile.ejs', {message: `Welcome, ${req.body.username}!`,loggedUser: req.session.username});
        }else{
            res.status(405).render('login.ejs', {message: 'Wrong password! Try again!', loggedUser: ''});
        }
        
    }
    res.status(200).end();
})

def.get('/logout', (req, res) => {
    req.session.destroy(async (e) => {
        if(e){
            res.status(500).send('Logout error.');
        }else {
            res.status(200).render('index.ejs', {message: 'Logout succesful!', loggedUser: ''});
        }
    })
})

def.get('/register', (req,res) =>  {
    res.status(200).render('register.ejs', { message: '', loggedUser: ''});
})

def.post('/register', async (req, res) => {
    const users = await Users.getUsers();
    if(!users.some((row) => row.username === req.body.username)){
        if(req.body.password === req.body.passwordagain){
            req.body.password = await bcrypt.hash(req.body.password,10);
            await Users.insertUser(req.body.username, req.body.password);
            res.status(200).render('index.ejs', { message: 'Succesfully registered!', loggedUser: ''});
        }
        else{
            res.status(200).render('register.ejs', { message: 'The passwords do not match!', loggedUser: '' });
        }
    } else {
        res.status(200).render('register.ejs', { message: 'This user already exists!', loggedUser: '' });
    }
})


export default def;