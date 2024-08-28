import express from 'express';
import bcrypt from 'bcrypt';
import Users from '../db/users.db.js';

export default function(connectedSockets) {
  const def = express.Router();

  def.get('/', (req, res) => {
    res.status(200).render('index.ejs', { message: '', loggedUser: '' });
  });

  def.get('/login', (req, res) => {
    res.status(200).render('login.ejs', { message: '', loggedUser: '' });
  });

  def.post('/login', express.json(), async (req, res) => {
    const correctPw = await Users.getUserPassword(req.body.username);
    if (correctPw === null) {
      res.status(404).render('login.ejs', { message: `The user '${req.body.username}' does not exist!`, loggedUser: '' });
    } else {
      const iscorrect = await bcrypt.compare(req.body.password, correctPw);
      if (iscorrect) {
        req.session.username = req.body.username;
        const role = await Users.getUserRole(req.body.username);
        req.session.role = role;
        const onlineUsers = Object.keys(connectedSockets);
        res.status(200).render('profile.ejs', { message: `Welcome, ${req.body.username}!`, loggedUser: req.session.username, connectedUsers: onlineUsers });
      } else {
        res.status(405).render('login.ejs', { message: 'Wrong password! Try again!', loggedUser: '' });
      }
    }
    res.status(200).end();
  });

  def.get('/logout', (req, res) => {
    req.session.destroy((e) => {
      if (e) {
        res.status(500).send('Logout error.');
      } else {
        res.status(200).render('index.ejs', { message: 'Logout successful!', loggedUser: '' });
      }
    });
  });

  def.get('/register', (req, res) => {
    res.status(200).render('register.ejs', { message: '', loggedUser: '' });
  });

  def.post('/register', async (req, res) => {
    const users = await Users.getUsers();
    if (!users.some((row) => row.username === req.body.username)) {
      if (req.body.password === req.body.passwordagain) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await Users.insertUser(req.body.username, req.body.password);
        res.status(200).render('index.ejs', { message: 'Successfully registered!', loggedUser: '' });
      } else {
        res.status(200).render('register.ejs', { message: 'The passwords do not match!', loggedUser: '' });
      }
    } else {
      res.status(200).render('register.ejs', { message: 'This user already exists!', loggedUser: '' });
    }
  });

  return def;
}
