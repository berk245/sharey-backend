const bcrypt = require("bcrypt");
const getUser = require('./getUser')

module.exports = async function (email, passwordFromRequest){
    const User = await getUser.byEmail(email);
    if (!User) return false;

    
    let isPasswordMatching = await bcrypt.compare(passwordFromRequest, User.password);
    if(!isPasswordMatching) return false

    return User
}