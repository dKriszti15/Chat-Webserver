import express from 'express'
import Users from '../db/users.db.js'
import bcrypt from 'bcrypt';

const userRouter = new express.Router();

userRouter.get('/modifyCredentials', (req, res) => {
    res.status(200).render('modifyCred.ejs', {message: '', loggedUser: req.session.username});
})

userRouter.post('/modifyCredentials', async (req, res) => {
    const users = await Users.getUserNames();
    console.log(users);
    if(users.some((user) => user.username === req.body.newusername)) {
        res.status(409).render('modifyCred.ejs', {message: 'This user already exists. Choose another username!', loggedUser: req.session.username});
    }else if (req.body.newpassword !== req.body.newpasswordagain){
        res.status(400).render('modifyCred.ejs', {message: 'The passwords do not match!', loggedUser: req.session.username})
    }else {
        req.body.newpassword = await bcrypt.hash(req.body.newpassword, 10); 
        await Users.modifyUser(req);
        req.session.username = req.body.newusername;
        res.status(200).render('index.ejs', {message: 'Credentials succesfully modified!', loggedUser: req.session.username})   
    }
})

export default userRouter;