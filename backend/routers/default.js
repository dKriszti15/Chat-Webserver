import express from 'express'
import path from 'path'

const def = express.Router();

const staticDir = path.join(process.cwd(), 'views');

def.use(express.static(staticDir));

def.get('/', (req, res) => {
    res.status(200).render('../../frontend/views/index.ejs');
})


export default def;