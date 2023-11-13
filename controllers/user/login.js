const {User } = require('../../models');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
    // collect the parameters from the request body
    const{ email, password } = req.body;
    //check if the user gave correct credentials
    if(!email || !password){
       return res.status(400).send('Input email and password')
    }else{
        // find if a user exist with this email, and if the password is correct
        const user = await User.findOne({ where: { email } });

        if(user && (await bcrypt.compare(password, user.password))){
            // sign in the user
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY
            )

            return res.status(200).send({
                message: "User has successfully signed in!",
                user,
                token
            })
            
        }else{
           return res.status(400).send({error: 'Invalid credentials'})
        }
    }
}

module.exports = loginUser