const db = require('./connection');
const bcrypt = require('bcryptjs')


// --- CREATE A USER (Create) 
async function createUser(avatar, firstName, lastName, organization, email, phoneNumber, userName, password) {
    const hash = createHash(password); 
    const result = await db.one(`
        insert into users
        (avatar, first_name, last_name, organization_name, email, phone_number, user_name, password)
        values
        ($1, $2, $3, $4, $5, $6, $7, $8)    
        returning user_id
    `, [avatar, firstName, lastName, organization, email, phoneNumber, userName, hash]);
    
    console.log(`user_id = ${result.user_id}`)
    return result.user_id;
};


// --- HASH USER PASSWORD
function createHash(password) {
    const salt =bcrypt.genSaltSync(10); 
    return bcrypt.hashSync(password, salt);
};


// --- USER LOGIN (Retrieve) 
    // userLogin: Runs getByUsername and retrieves username in db = to username given in form, then decrypts incrypted password in database and retrieves password = to password given in form

async function userLogin(username, password) {
    const theUser = await getByUsername(username);
    return {
        isUserValid: bcrypt.compareSync(password, theUser.password), 
        theUser
    }
};
async function getByUsername(username) {
    const theUser = await db.one(`
        select * from users where user_name=$1
    `, [username]);
    return theUser;
};











// EXPORTS
module.exports = {
    createUser,
    getByUsername,
    userLogin
}
