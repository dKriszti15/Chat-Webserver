import def from '../routers/default.js';
import pool from './pool.js'

export class User{
    async insertUser(username, passwd){
       
        try{
            const query = 'INSERT INTO users(username, pwd, role) VALUES (?, ?, ?)';
            const [user] = await pool.query(query,[username, passwd, 'user']);
            return user;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }

    async getUsers(){
        
        try{
            const query = 'SELECT * FROM users';
            const [users] = await pool.query(query);
            return users;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }

    async getUserNames(){
        
        try{
            const query = 'SELECT username FROM users';
            const [users] = await pool.query(query);
            return users;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }

    async getUserPassword(username){
        
        try{
            const query = 'SELECT pwd FROM users WHERE username = ?';
            const pass = await pool.query(query,[username]);
            return pass[0][0].pwd;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }

    async getUserRole(username){
        
        try{
            const query = 'SELECT role FROM users WHERE username = ?';
            const role = await pool.query(query,[username]);
            return role;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }

    async modifyUser(req){
        
        try{
            console.log(req.body.newusername, req.session.username);
            let query = 'UPDATE users SET username = ? WHERE username = ?';
            await pool.query(query,[req.body.newusername, req.session.username]);

            query = 'UPDATE users SET pwd = ? WHERE username = ?';
            await pool.query(query,[req.body.newpassword, req.body.newusername]);

            return 1;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }
}

const Users = new User();

export default Users;