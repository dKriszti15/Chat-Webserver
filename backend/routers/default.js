import express from 'express'
import path from 'path'
import bcrypt from 'bcrypt';
import Users from '../db/users.db.js'

const def = express.Router();

//const staticDir = path.join(process.cwd(), 'frontend/views');

//def.use(express.static(staticDir));

def.get('/', (req, res) => {
    res.status(200).render('index.ejs');
})

def.get('/register', (req,res) =>  {
    res.status(200).render('register.ejs', { message: ''});
})

def.post('/register', async (req, res) => {
    const users = await Users.getUsers();
    if(!users.some((row) => row.username === req.body.username)){
        if(req.body.password === req.body.passwordagain){
            req.body.password = await bcrypt.hash(req.body.password,10);
            await Users.insertUser(req.body.username, req.body.password, req.body.role);
            res.status(200).render('register.ejs', { message: 'Succesfully registered!'});
        }
        else{
            res.status(200).render('register.ejs', { message: 'The passwords do not match!' });
        }
    } else {
        res.status(200).render('register.ejs', { message: 'This user already exists!' });
    }
})


export default def;