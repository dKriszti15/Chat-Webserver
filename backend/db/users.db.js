import def from '../routers/default.js';
import pool from './pool.js'

export class User{
    async insertUser(username, passwd, role){
        const query = 'INSERT INTO users(username, pwd, role) VALUES (?, ?, ?)';
        try{
            const [user] = await pool.query(query,[username, passwd, role]);
            return user;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }

    async getUsers(){
        const query = 'SELECT * FROM users';
        try{
            const [users] = await pool.query(query);
            return users;
        }
        catch (e){
            console.log(e);
            return -1;
        }
    }
}

const Users = new User();

export default Users;